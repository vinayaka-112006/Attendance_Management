import { ZodError } from "zod";

export const notFound = (req, _res, next) => {
  next(Object.assign(new Error(`Route not found: ${req.method} ${req.originalUrl}`), { status: 404 }));
};

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Please check the highlighted fields.", errors: err.flatten() });
  }

  if (err.code === "P2002") {
    const fields = err.meta?.target;
    return res.status(409).json({ message: duplicateMessage(fields), fields });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
};

const duplicateMessage = (fields = []) => {
  const list = Array.isArray(fields) ? fields : [fields];
  if (list.includes("code") && list.includes("sectionId")) {
    return "This subject code is already used for the selected class. Use a different code for this class.";
  }
  if (list.includes("code")) {
    return "This subject code is already used. If this is for another class, please sync the database indexes and try again.";
  }
  if (list.includes("email")) return "This email address is already registered.";
  if (list.includes("rollNo")) return "This roll number is already registered.";
  if (list.includes("employeeId")) return "This employee ID is already registered.";
  return "A record with these details already exists.";
};
