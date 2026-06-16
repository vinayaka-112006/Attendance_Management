import { Router } from "express";
import multer from "multer";
import { bulkImportStudents, createStudent, deleteStudent, getStudent, listStudents, updateStudent } from "../controllers/student.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { studentSchema, studentUpdateSchema } from "../validations/schemas.js";
import { idParam } from "../validations/common.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.use(authenticate);
router.get("/", authorize("ADMIN", "FACULTY"), listStudents);
router.get("/:id", authorize("ADMIN", "FACULTY"), validate(idParam), getStudent);
router.post("/", authorize("ADMIN"), validate(studentSchema), createStudent);
router.post("/bulk-import", authorize("ADMIN"), upload.single("file"), bulkImportStudents);
router.put("/:id", authorize("ADMIN"), validate(idParam), validate(studentUpdateSchema), updateStudent);
router.delete("/:id", authorize("ADMIN"), validate(idParam), deleteStudent);

export default router;
