import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const where = req.user.role === "STUDENT" ? { studentId: req.user.student?.id } : {};
  res.json(await prisma.notification.findMany({ where, include: { student: true }, orderBy: { sentAt: "desc" } }));
});
