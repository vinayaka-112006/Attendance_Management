import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import studentRoutes from "./routes/student.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";
import sectionRoutes from "./routes/section.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import reportRoutes from "./routes/report.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);
