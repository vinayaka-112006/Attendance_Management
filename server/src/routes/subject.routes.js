import { Router } from "express";
import { createSubject, deleteSubject, listSubjects, updateSubject } from "../controllers/subject.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { subjectSchema } from "../validations/schemas.js";
import { idParam } from "../validations/common.js";

const router = Router();
router.use(authenticate);
router.get("/", authorize("ADMIN", "FACULTY", "STUDENT"), listSubjects);
router.post("/", authorize("ADMIN"), validate(subjectSchema), createSubject);
router.put("/:id", authorize("ADMIN"), validate(idParam), validate(subjectSchema), updateSubject);
router.delete("/:id", authorize("ADMIN"), validate(idParam), deleteSubject);

export default router;
