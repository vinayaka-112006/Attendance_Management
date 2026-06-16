import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";

export const attendanceValue = (status) => {
  if (status === "PRESENT") return 1;
  if (status === "LATE") return env.lateWeight;
  return 0;
};

export const summarizeAttendance = (records, threshold = env.attendanceThreshold) => {
  const totalClasses = records.length;
  const classesAttended = records.reduce((sum, item) => sum + attendanceValue(item.status), 0);
  const attendancePercentage = totalClasses ? Number(((classesAttended / totalClasses) * 100).toFixed(2)) : 0;
  return {
    totalClasses,
    classesAttended,
    attendancePercentage,
    defaulter: totalClasses > 0 && attendancePercentage < threshold
  };
};

export const getStudentSubjectSummary = async (studentId, subjectId, threshold = env.attendanceThreshold) => {
  const records = await prisma.attendance.findMany({ where: { studentId, subjectId } });
  return summarizeAttendance(records, threshold);
};

export const classesCanMissBeforeRisk = (total, attended, threshold = env.attendanceThreshold) => {
  const ratio = threshold / 100;
  let misses = 0;
  while (total + misses + 1 > 0 && attended / (total + misses + 1) >= ratio) misses += 1;
  return misses;
};
