import { Router } from "express";
import { adminDashboard, facultyDashboard, studentDashboard, updateThreshold } from "../controllers/dashboard.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);
router.get("/admin", authorize("ADMIN"), adminDashboard);
router.put("/threshold", authorize("ADMIN"), updateThreshold);
router.get("/faculty", authorize("FACULTY"), facultyDashboard);
router.get("/student", authorize("STUDENT"), studentDashboard);

export default router;
