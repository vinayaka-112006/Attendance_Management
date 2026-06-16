import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { auditLog } from "../services/audit.service.js";

export const listSections = asyncHandler(async (_req, res) => {
  res.json(await prisma.section.findMany({ include: { _count: { select: { students: true, subjects: true } } }, orderBy: { name: "asc" } }));
});

export const createSection = asyncHandler(async (req, res) => {
  const section = await prisma.section.create({ data: req.body });
  await auditLog({ userId: req.user.id, action: "CREATE", entity: "Section", entityId: section.id, afterData: section });
  res.status(201).json(section);
});

export const updateSection = asyncHandler(async (req, res) => {
  const beforeData = await prisma.section.findUnique({ where: { id: req.params.id } });
  const section = await prisma.section.update({ where: { id: req.params.id }, data: req.body });
  await auditLog({ userId: req.user.id, action: "UPDATE", entity: "Section", entityId: section.id, beforeData, afterData: section });
  res.json(section);
});

export const deleteSection = asyncHandler(async (req, res) => {
  const beforeData = await prisma.section.findUnique({ where: { id: req.params.id } });
  await prisma.section.delete({ where: { id: req.params.id } });
  await auditLog({ userId: req.user.id, action: "DELETE", entity: "Section", entityId: req.params.id, beforeData });
  res.status(204).send();
});
