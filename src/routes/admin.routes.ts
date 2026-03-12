import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  getAllRepairJobs,
  updateRepairJobStatus,
  getAdminStats,
} from "../controllers/admin.controller";

const router = express.Router();

// Only ADMIN
router.get("/repair-jobs", authenticate, authorize("ADMIN"), getAllRepairJobs);
router.put("/repair-jobs/:id", authenticate, authorize("ADMIN"), updateRepairJobStatus);
router.get("/stats", authenticate, authorize("ADMIN"), getAdminStats);

export default router;