import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";

const ATTENDANCE_THRESHOLD_KEY = "attendanceThreshold";

export const getAttendanceThreshold = async () => {
  const setting = await prisma.appSetting.findUnique({ where: { key: ATTENDANCE_THRESHOLD_KEY } });
  const value = Number(setting?.value ?? env.attendanceThreshold);
  return Number.isFinite(value) ? value : env.attendanceThreshold;
};

export const setAttendanceThreshold = async (threshold) => {
  const value = Number(threshold);
  return prisma.appSetting.upsert({
    where: { key: ATTENDANCE_THRESHOLD_KEY },
    update: { value },
    create: { key: ATTENDANCE_THRESHOLD_KEY, value }
  });
};
