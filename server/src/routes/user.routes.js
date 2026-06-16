import { Router } from "express";
import { createUser, deleteUser, listUsers } from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { userCreateSchema } from "../validations/schemas.js";
import { idParam } from "../validations/common.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));
router.get("/", listUsers);
router.post("/", validate(userCreateSchema), createUser);
router.delete("/:id", validate(idParam), deleteUser);

export default router;
