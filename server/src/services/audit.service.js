import { prisma } from "../config/prisma.js";

export const auditLog = async ({ userId, action, entity, entityId, beforeData, afterData }) => {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      beforeData: beforeData ?? undefined,
      afterData: afterData ?? undefined
    }
  });
};
