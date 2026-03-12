import { Router } from "express";
// import { generateAIDiagnosis } from "../controllers/repairJob.controller";
// import { generateInvoice } from "../controllers/repairJob.controller";
import upload from "../middleware/upload";
import {
  createRepairJob,
  getMyRepairJobs,
  getAllRepairJobs,
  updateRepairJobStatus,
  assignStaff,
  updateRepairJob
} from "../controllers/repairJob.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();


router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  upload.single("image"),
  createRepairJob
);

router.get(
  "/my",
  authenticate,
  authorize("CUSTOMER"),
  getMyRepairJobs
);


router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getAllRepairJobs
);

router.put(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  updateRepairJobStatus
);

router.put(
  "/:id/assign",
  authenticate,
  authorize("ADMIN"),
  assignStaff
);


router.put(
  "/:id/update",
  authenticate,
  authorize("STAFF"),
  updateRepairJob
);

// router.post(
//   "/:id/ai-diagnosis",
//   authenticate,
//   authorize("ADMIN"),
//   generateAIDiagnosis
// );

// router.get(
//   "/:id/invoice",
//   authenticate,
//   authorize("ADMIN"),
//   generateInvoice
// );


export default router;
