import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashPassword } from "../services/auth.service.js";
import { auditLog } from "../services/audit.service.js";

const selectSafe = { id: true, email: true, role: true, createdAt: true, student: true, faculty: true };

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({ select: selectSafe, orderBy: { createdAt: "desc" } });
  res.json(users);
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      passwordHash: await hashPassword(req.body.password),
      role: req.body.role
    },
    select: selectSafe
  });
  await auditLog({ userId: req.user.id, action: "CREATE", entity: "User", entityId: user.id, afterData: user });
  res.status(201).json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const beforeData = await prisma.user.findUnique({ where: { id: req.params.id }, select: selectSafe });
  await prisma.user.delete({ where: { id: req.params.id } });
  await auditLog({ userId: req.user.id, action: "DELETE", entity: "User", entityId: req.params.id, beforeData });
  res.status(204).send();
});
