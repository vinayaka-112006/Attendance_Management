import { Router } from "express";
import { createSection, deleteSection, listSections, updateSection } from "../controllers/section.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { sectionSchema } from "../validations/schemas.js";
import { idParam } from "../validations/common.js";

const router = Router();
router.use(authenticate);
router.get("/", authorize("ADMIN", "FACULTY"), listSections);
router.post("/", authorize("ADMIN"), validate(sectionSchema), createSection);
router.put("/:id", authorize("ADMIN"), validate(idParam), validate(sectionSchema), updateSection);
router.delete("/:id", authorize("ADMIN"), validate(idParam), deleteSection);

export default router;
