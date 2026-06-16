import { Router } from "express";
import { createFaculty, deleteFaculty, listFaculty, updateFaculty } from "../controllers/faculty.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { facultySchema, facultyUpdateSchema } from "../validations/schemas.js";
import { idParam } from "../validations/common.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));
router.get("/", listFaculty);
router.post("/", validate(facultySchema), createFaculty);
router.put("/:id", validate(idParam), validate(facultyUpdateSchema), updateFaculty);
router.delete("/:id", validate(idParam), deleteFaculty);

export default router;
