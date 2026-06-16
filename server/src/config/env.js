import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  attendanceThreshold: Number(process.env.ATTENDANCE_THRESHOLD || 75),
  lateWeight: Number(process.env.LATE_WEIGHT || 0.5),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  sendgridApiKey: process.env.SENDGRID_API_KEY || "",
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || "no-reply@attendease.local",
  enableEmailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS === "true"
};
