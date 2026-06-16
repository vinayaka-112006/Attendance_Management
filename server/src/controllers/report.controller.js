import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { summarizeAttendance } from "../services/attendance.service.js";
import { getAttendanceThreshold } from "../services/settings.service.js";

export const getReports = asyncHandler(async (req, res) => {
  res.json(await buildReport(req));
});

export const exportExcel = asyncHandler(async (req, res) => {
  const report = await buildReport(req);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Attendance Report");
  sheet.columns = [
    { header: "Student", key: "student", width: 24 },
    { header: "Roll No", key: "rollNo", width: 14 },
    { header: "Subject", key: "subject", width: 24 },
    { header: "Total Classes", key: "totalClasses", width: 14 },
    { header: "Attended", key: "classesAttended", width: 12 },
    { header: "Percentage", key: "attendancePercentage", width: 12 },
    { header: "Defaulter", key: "defaulter", width: 10 }
  ];
  report.forEach((row) => sheet.addRow({ ...row, defaulter: row.defaulter ? "Yes" : "No" }));
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=attendance-report.xlsx");
  await workbook.xlsx.write(res);
  res.end();
});

export const exportPdf = asyncHandler(async (req, res) => {
  const report = await buildReport(req);
  const doc = new PDFDocument({ margin: 36 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=attendance-report.pdf");
  doc.pipe(res);
  doc.fontSize(18).text("AttendEase Attendance Report");
  doc.moveDown();
  report.forEach((row) => {
    doc.fontSize(10).text(`${row.student} (${row.rollNo}) | ${row.subject} | ${row.attendancePercentage}% | ${row.defaulter ? "Defaulter" : "OK"}`);
  });
  doc.end();
});

const buildReport = async (req) => {
  const threshold = await getAttendanceThreshold();
  const where = {};
  if (req.query.studentId) where.studentId = req.query.studentId;
  if (req.query.subjectId) where.subjectId = req.query.subjectId;
  if (req.query.from || req.query.to) {
    where.date = {};
    if (req.query.from) where.date.gte = new Date(req.query.from);
    if (req.query.to) where.date.lte = new Date(req.query.to);
  }
  if (req.user.role === "FACULTY") where.subject = { is: { facultyId: req.user.faculty?.id } };
  if (req.user.role === "STUDENT") where.studentId = req.user.student?.id;
  if (req.query.sectionId) where.student = { is: { sectionId: req.query.sectionId } };

  const records = await prisma.attendance.findMany({
    where,
    include: { student: true, subject: true },
    orderBy: [{ studentId: "asc" }, { subjectId: "asc" }, { date: "asc" }]
  });

  const groups = new Map();
  for (const item of records) {
    const key = `${item.studentId}:${item.subjectId}`;
    if (!groups.has(key)) groups.set(key, { student: item.student, subject: item.subject, records: [] });
    groups.get(key).records.push(item);
  }

  return [...groups.values()].map((group) => ({
    studentId: group.student.id,
    student: group.student.name,
    rollNo: group.student.rollNo,
    subjectId: group.subject.id,
    subject: group.subject.name,
    ...summarizeAttendance(group.records, threshold)
  }));
};
