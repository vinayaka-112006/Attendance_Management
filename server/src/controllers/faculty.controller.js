import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashPassword } from "../services/auth.service.js";
import { auditLog } from "../services/audit.service.js";

const include = { user: { select: { id: true, email: true, role: true } }, subjects: true };

export const listFaculty = asyncHandler(async (_req, res) => {
  res.json(await prisma.faculty.findMany({ include, orderBy: { name: "asc" } }));
});

export const createFaculty = asyncHandler(async (req, res) => {
  const data = req.body;
  const userId = data.userId || (await prisma.user.create({
    data: { email: data.email, passwordHash: await hashPassword(data.password || "password123"), role: "FACULTY" }
  })).id;
  const faculty = await prisma.faculty.create({ data: { userId, name: data.name, department: data.department, employeeId: data.employeeId }, include });
  await auditLog({ userId: req.user.id, action: "CREATE", entity: "Faculty", entityId: faculty.id, afterData: faculty });
  res.status(201).json(faculty);
});

export const updateFaculty = asyncHandler(async (req, res) => {
  const beforeData = await prisma.faculty.findUnique({ where: { id: req.params.id } });
  const faculty = await prisma.faculty.update({
    where: { id: req.params.id },
    data: { name: req.body.name, department: req.body.department, employeeId: req.body.employeeId },
    include
  });
  await auditLog({ userId: req.user.id, action: "UPDATE", entity: "Faculty", entityId: faculty.id, beforeData, afterData: faculty });
  res.json(faculty);
});

export const deleteFaculty = asyncHandler(async (req, res) => {
  const beforeData = await prisma.faculty.findUnique({ where: { id: req.params.id } });
  await prisma.faculty.delete({ where: { id: req.params.id } });
  await auditLog({ userId: req.user.id, action: "DELETE", entity: "Faculty", entityId: req.params.id, beforeData });
  res.status(204).send();
});
