import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashPassword } from "../services/auth.service.js";
import { auditLog } from "../services/audit.service.js";

const include = { user: { select: { id: true, email: true, role: true } }, section: true };

export const listStudents = asyncHandler(async (req, res) => {
  const where = req.query.sectionId ? { sectionId: req.query.sectionId } : {};
  res.json(await prisma.student.findMany({ where, include, orderBy: { rollNo: "asc" } }));
});

export const getStudent = asyncHandler(async (req, res) => {
  res.json(await prisma.student.findUniqueOrThrow({ where: { id: req.params.id }, include }));
});

export const createStudent = asyncHandler(async (req, res) => {
  const data = req.body;
  const userId = data.userId || (await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: await hashPassword(data.password || "password123"),
      role: "STUDENT"
    }
  })).id;
  const student = await prisma.student.create({
    data: { userId, rollNo: data.rollNo, name: data.name, sectionId: data.sectionId, semester: data.semester, photoUrl: data.photoUrl || null },
    include
  });
  await auditLog({ userId: req.user.id, action: "CREATE", entity: "Student", entityId: student.id, afterData: student });
  res.status(201).json(student);
});

export const updateStudent = asyncHandler(async (req, res) => {
  const beforeData = await prisma.student.findUnique({ where: { id: req.params.id } });
  const student = await prisma.student.update({
    where: { id: req.params.id },
    data: {
      rollNo: req.body.rollNo,
      name: req.body.name,
      sectionId: req.body.sectionId,
      semester: req.body.semester,
      photoUrl: req.body.photoUrl || null
    },
    include
  });
  await auditLog({ userId: req.user.id, action: "UPDATE", entity: "Student", entityId: student.id, beforeData, afterData: student });
  res.json(student);
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const beforeData = await prisma.student.findUnique({ where: { id: req.params.id } });
  await prisma.student.delete({ where: { id: req.params.id } });
  await auditLog({ userId: req.user.id, action: "DELETE", entity: "Student", entityId: req.params.id, beforeData });
  res.status(204).send();
});

export const bulkImportStudents = asyncHandler(async (req, res) => {
  const rows = req.file ? parseCsv(req.file.buffer.toString("utf8")) : req.body.students || [];
  const created = [];
  for (const row of rows) {
    const user = await prisma.user.create({
      data: { email: row.email, passwordHash: await hashPassword(row.password || "password123"), role: "STUDENT" }
    });
    created.push(await prisma.student.create({
      data: { userId: user.id, rollNo: row.rollNo, name: row.name, sectionId: row.sectionId, semester: Number(row.semester), photoUrl: row.photoUrl || null }
    }));
  }
  await auditLog({ userId: req.user.id, action: "BULK_IMPORT", entity: "Student", afterData: { count: created.length } });
  res.status(201).json({ count: created.length, students: created });
});

const parseCsv = (text) => {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((item) => item.trim());
  return lines.filter(Boolean).map((line) => {
    const values = line.split(",").map((item) => item.trim());
    return headers.reduce((row, header, index) => ({ ...row, [header]: values[index] || "" }), {});
  });
};
