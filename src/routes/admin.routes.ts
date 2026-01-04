import { Router } from "express";
import {
  getAllUsers,
  updateUserStatus,
  getDashboardStats
} from "../controllers/admin.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

/**
 * ADMIN ONLY
 */
router.get(
  "/users",
  authenticate,
  authorize("ADMIN"),
  getAllUsers
);

router.put(
  "/users/:id/status",
  authenticate,
  authorize("ADMIN"),
  updateUserStatus
);

router.get(
  "/dashboard",
  authenticate,
  authorize("ADMIN"),
  getDashboardStats
);

export default router;
