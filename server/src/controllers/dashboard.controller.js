import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { dayRange } from "../utils/date.js";
import { classesCanMissBeforeRisk, summarizeAttendance } from "../services/attendance.service.js";
import { getAttendanceThreshold, setAttendanceThreshold } from "../services/settings.service.js";
import { auditLog } from "../services/audit.service.js";

export const adminDashboard = asyncHandler(async (_req, res) => {
  const threshold = await getAttendanceThreshold();
  const [totalStudents, subjectCount, todayAttendance, auditLogs, allAttendance] = await Promise.all([
    prisma.student.count(),
    prisma.subject.count(),
    prisma.attendance.findMany({ where: { date: dayRange(new Date()) } }),
    prisma.auditLog.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { user: { select: { email: true, role: true } } } }),
    prisma.attendance.findMany()
  ]);
  const today = summarizeAttendance(todayAttendance, threshold);
  const grouped = Object.groupBy ? Object.groupBy(allAttendance, (a) => a.studentId) : groupBy(allAttendance, (a) => a.studentId);
  const activeDefaulters = Object.values(grouped).filter((records) => summarizeAttendance(records, threshold).defaulter).length;
  res.json({ totalStudents, todayAttendancePercentage: today.attendancePercentage, activeDefaulters, subjectCount, recentActivity: auditLogs, threshold });
});

export const facultyDashboard = asyncHandler(async (req, res) => {
  const subjects = await prisma.subject.findMany({ where: { facultyId: req.user.faculty?.id }, include: { section: true } });
  const today = await prisma.attendance.findMany({ where: { subject: { is: { facultyId: req.user.faculty?.id } }, date: dayRange(new Date()) }, include: { subject: true } });
  res.json({
    todayClasses: subjects,
    lastMarkedStatus: today.length ? "Marked" : "Pending",
    markedToday: today.length
  });
});

export const studentDashboard = asyncHandler(async (req, res) => {
  const threshold = await getAttendanceThreshold();
  const studentId = req.user.student?.id;
  const subjects = await prisma.subject.findMany({ where: { sectionId: req.user.student?.sectionId } });
  const allRecords = await prisma.attendance.findMany({ where: { studentId } });
  const overall = summarizeAttendance(allRecords, threshold);
  const subjectSummaries = [];
  for (const subject of subjects) {
    const records = await prisma.attendance.findMany({ where: { studentId, subjectId: subject.id } });
    const summary = summarizeAttendance(records, threshold);
    subjectSummaries.push({
      subject,
      ...summary,
      canMiss: classesCanMissBeforeRisk(summary.totalClasses, summary.classesAttended, threshold),
      risk: summary.attendancePercentage < threshold
    });
  }
  res.json({ student: req.user.student, subjectSummaries, overall, threshold });
});

export const updateThreshold = asyncHandler(async (req, res) => {
  const threshold = Number(req.body.threshold);
  if (!Number.isFinite(threshold) || threshold < 1 || threshold > 100) {
    return res.status(400).json({ message: "Threshold must be between 1 and 100" });
  }
  const setting = await setAttendanceThreshold(threshold);
  await auditLog({
    userId: req.user.id,
    action: "UPDATE",
    entity: "AppSetting",
    entityId: setting.id,
    afterData: { key: setting.key, value: setting.value }
  });
  res.json({ threshold: setting.value });
});

const groupBy = (items, fn) =>
  items.reduce((acc, item) => {
    const key = fn(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
