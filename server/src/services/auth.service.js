import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const hashPassword = (password) => bcrypt.hash(password, 12);
export const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

export const signToken = (user) =>
  jwt.sign({ role: user.role, email: user.email }, env.jwtSecret, {
    subject: user.id,
    expiresIn: env.jwtExpiresIn
  });
