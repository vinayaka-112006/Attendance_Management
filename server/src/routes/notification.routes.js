import { Router } from "express";
import { listNotifications } from "../controllers/notification.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();
router.use(authenticate, authorize("ADMIN", "STUDENT"));
router.get("/", listNotifications);

export default router;
