import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { hashPassword, signToken, verifyPassword } from "../services/auth.service.js";
import { auditLog } from "../services/audit.service.js";

export const register = asyncHandler(async (req, res) => {
  const user = await createAuthUser(req.body);
  res.status(201).json({ token: signToken(user), user: sanitizeUser(user) });
});

export const registerStudent = asyncHandler(async (req, res) => {
  const { email, password, role, rollNo, name, sectionId, semester, department, employeeId, photoUrl } = req.body;

  const user = await prisma.user.create({
    data: { email, passwordHash: await hashPassword(password), role }
  });

  let student = null;
  let faculty = null;
  if (role === "STUDENT") {
    const section = await prisma.section.findUnique({ where: { id: sectionId } });
    if (!section) throw new HttpError(400, "Invalid section");
    student = await prisma.student.create({
      data: { userId: user.id, rollNo, name, sectionId, semester, photoUrl: photoUrl || null }
    });
  }

  if (role === "FACULTY") {
    faculty = await prisma.faculty.create({
      data: { userId: user.id, name, department, employeeId }
    });
  }

  const completeUser = { ...user, student, faculty };
  await auditLog({ userId: user.id, action: "REGISTER", entity: role, entityId: student?.id || faculty?.id || user.id, afterData: { userId: user.id } });
  res.status(201).json({ token: signToken(user), user: sanitizeUser(completeUser) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
    include: { student: true, faculty: true }
  });
  if (!user || !(await verifyPassword(req.body.password, user.passwordHash))) {
    throw new HttpError(401, "Invalid email or password");
  }
  res.json({ token: signToken(user), user: sanitizeUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

export const registerSections = asyncHandler(async (_req, res) => {
  const sections = await prisma.section.findMany({
    select: { id: true, name: true, batchYear: true, department: true },
    orderBy: { name: "asc" }
  });
  res.json(sections);
});

const sanitizeUser = (user) => {
  const { passwordHash, ...safe } = user;
  return safe;
};

const createAuthUser = async ({ email, password, role }) => {
  const user = await prisma.user.create({
    data: { email, passwordHash: await hashPassword(password), role: role || "STUDENT" }
  });
  await auditLog({ userId: user.id, action: "CREATE", entity: "User", entityId: user.id, afterData: user });
  return user;
};
