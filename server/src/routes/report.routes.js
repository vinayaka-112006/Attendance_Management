import { Router } from "express";
import { exportExcel, exportPdf, getReports } from "../controllers/report.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { reportQuerySchema } from "../validations/schemas.js";

const router = Router();
router.use(authenticate, authorize("ADMIN", "FACULTY", "STUDENT"));
router.get("/", validate(reportQuerySchema), getReports);
router.get("/export/excel", validate(reportQuerySchema), exportExcel);
router.get("/export/pdf", validate(reportQuerySchema), exportPdf);

export default router;
