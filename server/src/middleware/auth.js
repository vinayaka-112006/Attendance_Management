import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

export const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new HttpError(401, "Missing bearer token");

    const payload = jwt.verify(header.slice(7), env.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { student: true, faculty: true }
    });

    if (!user) throw new HttpError(401, "Invalid token user");
    req.user = user;
    next();
  } catch (error) {
    next(error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" ? new HttpError(401, "Invalid or expired token") : error);
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) return next(new HttpError(403, "Forbidden"));
  next();
};
