import { prisma } from "../config/prisma.js";
import { sendEmail } from "./email.service.js";

export const createThresholdNotification = async ({ studentId, message }) => {
  const student = await prisma.student.findUnique({ where: { id: studentId }, include: { user: true } });
  if (!student) return null;

  const emailResult = await sendEmail({
    to: student.user.email,
    subject: "AttendEase attendance warning",
    text: message
  });

  return prisma.notification.create({
    data: {
      studentId,
      type: "DEFAULTER",
      message,
      sentAt: new Date(),
      deliveryStatus: emailResult.status
    }
  });
};
