import { Router } from "express";
import { listAttendance, markAttendance, roster, updateAttendance } from "../controllers/attendance.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { attendanceMarkSchema, attendanceUpdateSchema } from "../validations/schemas.js";
import { idParam } from "../validations/common.js";

const router = Router();
router.use(authenticate);
router.get("/", authorize("ADMIN", "FACULTY", "STUDENT"), listAttendance);
router.get("/roster", authorize("ADMIN", "FACULTY"), roster);
router.post("/", authorize("ADMIN", "FACULTY"), validate(attendanceMarkSchema), markAttendance);
router.put("/:id", authorize("ADMIN", "FACULTY"), validate(idParam), validate(attendanceUpdateSchema), updateAttendance);

export default router;
