import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { auditLog } from "../services/audit.service.js";
import { HttpError } from "../utils/httpError.js";

const include = { faculty: true, section: true };

export const listSubjects = asyncHandler(async (req, res) => {
  const where = req.user.role === "FACULTY"
    ? { facultyId: req.user.faculty?.id }
    : req.user.role === "STUDENT"
      ? { sectionId: req.user.student?.sectionId }
      : {};
  res.json(await prisma.subject.findMany({ where, include, orderBy: { code: "asc" } }));
});

export const createSubject = asyncHandler(async (req, res) => {
  const data = normalizeSubject(req.body);
  await assertSubjectCodeAvailable(data);
  const subject = await prisma.subject.create({ data, include });
  await auditLog({ userId: req.user.id, action: "CREATE", entity: "Subject", entityId: subject.id, afterData: subject });
  res.status(201).json(subject);
});

export const updateSubject = asyncHandler(async (req, res) => {
  const data = normalizeSubject(req.body);
  await assertSubjectCodeAvailable(data, req.params.id);
  const beforeData = await prisma.subject.findUnique({ where: { id: req.params.id } });
  const subject = await prisma.subject.update({ where: { id: req.params.id }, data, include });
  await auditLog({ userId: req.user.id, action: "UPDATE", entity: "Subject", entityId: subject.id, beforeData, afterData: subject });
  res.json(subject);
});

export const deleteSubject = asyncHandler(async (req, res) => {
  const beforeData = await prisma.subject.findUnique({ where: { id: req.params.id } });
  await prisma.subject.delete({ where: { id: req.params.id } });
  await auditLog({ userId: req.user.id, action: "DELETE", entity: "Subject", entityId: req.params.id, beforeData });
  res.status(204).send();
});

const normalizeSubject = (body) => ({
  ...body,
  code: body.code.trim().toUpperCase(),
  name: body.name.trim()
});

const assertSubjectCodeAvailable = async ({ code, sectionId }, currentSubjectId = null) => {
  const existing = await prisma.subject.findFirst({
    where: {
      code,
      sectionId,
      ...(currentSubjectId ? { id: { not: currentSubjectId } } : {})
    },
    include: { section: true }
  });

  if (existing) {
    const sectionName = existing.section?.name ? ` for ${existing.section.name}` : " for this class";
    throw new HttpError(409, `Subject code ${code} is already used${sectionName}. Use a different code for this class.`);
  }
};
