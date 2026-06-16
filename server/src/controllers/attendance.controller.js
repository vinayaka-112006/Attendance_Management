import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { dayRange, isSameCalendarDay, normalizeDate } from "../utils/date.js";
import { auditLog } from "../services/audit.service.js";
import { createThresholdNotification } from "../services/notification.service.js";
import { getStudentSubjectSummary } from "../services/attendance.service.js";
import { getAttendanceThreshold } from "../services/settings.service.js";

export const roster = asyncHandler(async (req, res) => {
  const subject = await getAllowedSubject(req);
  const date = normalizeDate(req.query.date || new Date());
  const students = await prisma.student.findMany({ where: { sectionId: subject.sectionId }, orderBy: { rollNo: "asc" } });
  const attendance = await prisma.attendance.findMany({ where: { subjectId: subject.id, date } });
  const byStudent = new Map(attendance.map((item) => [item.studentId, item]));
  res.json(students.map((student) => ({ ...student, attendance: byStudent.get(student.id) || null })));
});

export const markAttendance = asyncHandler(async (req, res) => {
  const subject = await getAllowedSubject(req);
  const date = normalizeDate(req.body.date);
  const existingCount = await prisma.attendance.count({
    where: {
      subjectId: subject.id,
      date,
      studentId: { in: req.body.entries.map((entry) => entry.studentId) }
    }
  });
  if (existingCount) throw new HttpError(409, "Attendance is already marked for one or more selected students on this date");

  const created = [];

  for (const entry of req.body.entries) {
    const student = await prisma.student.findUnique({ where: { id: entry.studentId } });
    if (!student || student.sectionId !== subject.sectionId) throw new HttpError(400, "Student is not in this subject section");

    const item = await prisma.attendance.create({
      data: {
        studentId: entry.studentId,
        subjectId: subject.id,
        date,
        status: entry.status || "ABSENT",
        markedBy: req.user.id
      },
      include: { student: true, subject: true }
    });
    created.push(item);
    await maybeNotifyDefaulter(entry.studentId, subject.id);
  }

  await auditLog({ userId: req.user.id, action: "CREATE", entity: "Attendance", afterData: { count: created.length, subjectId: subject.id, date } });
  res.status(201).json(created);
});

export const updateAttendance = asyncHandler(async (req, res) => {
  const attendance = await prisma.attendance.findUniqueOrThrow({ where: { id: req.params.id }, include: { subject: true } });
  if (req.user.role === "FACULTY") {
    if (attendance.subject.facultyId !== req.user.faculty?.id) throw new HttpError(403, "Forbidden");
    if (!isSameCalendarDay(attendance.date)) throw new HttpError(403, "Faculty can edit only on the same calendar day");
  }

  if (req.user.role === "ADMIN" && !req.body.reason) throw new HttpError(400, "Correction reason is mandatory");

  const updated = await prisma.attendance.update({
    where: { id: req.params.id },
    data: { status: req.body.status },
    include: { student: true, subject: true }
  });

  if (attendance.status !== req.body.status) {
    await prisma.attendanceCorrection.create({
      data: {
        attendanceId: attendance.id,
        oldStatus: attendance.status,
        newStatus: req.body.status,
        reason: req.body.reason || "Same-day faculty correction",
        correctedBy: req.user.id
      }
    });
  }
  await auditLog({ userId: req.user.id, action: "CORRECT", entity: "Attendance", entityId: attendance.id, beforeData: attendance, afterData: updated });
  await maybeNotifyDefaulter(attendance.studentId, attendance.subjectId);
  res.json(updated);
});

export const listAttendance = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.subjectId) where.subjectId = req.query.subjectId;
  if (req.query.studentId) where.studentId = req.query.studentId;
  if (req.query.date) where.date = dayRange(req.query.date);
  if (req.user.role === "FACULTY") where.subject = { is: { facultyId: req.user.faculty?.id } };
  if (req.user.role === "STUDENT") where.studentId = req.user.student?.id;
  res.json(await prisma.attendance.findMany({ where, include: { student: true, subject: true }, orderBy: { date: "desc" } }));
});

const getAllowedSubject = async (req) => {
  const subjectId = req.body.subjectId || req.query.subjectId;
  const subject = await prisma.subject.findUniqueOrThrow({ where: { id: subjectId } });
  if (req.user.role === "FACULTY" && subject.facultyId !== req.user.faculty?.id) throw new HttpError(403, "Forbidden");
  return subject;
};

const maybeNotifyDefaulter = async (studentId, subjectId) => {
  const threshold = await getAttendanceThreshold();
  const summary = await getStudentSubjectSummary(studentId, subjectId, threshold);
  if (summary.totalClasses && summary.attendancePercentage < threshold) {
    await createThresholdNotification({
      studentId,
      message: `Your attendance is ${summary.attendancePercentage}% and below the ${threshold}% threshold.`
    });
  }
};
