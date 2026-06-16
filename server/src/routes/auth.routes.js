import { Router } from "express";
import { login, me, register, registerSections, registerStudent } from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema, studentRegisterSchema } from "../validations/schemas.js";

const router = Router();

router.post("/register", validate(studentRegisterSchema), registerStudent);
router.get("/register-sections", registerSections);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, me);
router.post("/admin/register", authenticate, authorize("ADMIN"), validate(registerSchema), register);

export default router;
