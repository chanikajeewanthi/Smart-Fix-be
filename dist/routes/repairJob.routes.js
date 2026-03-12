"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { generateAIDiagnosis } from "../controllers/repairJob.controller";
// import { generateInvoice } from "../controllers/repairJob.controller";
const upload_1 = __importDefault(require("../middleware/upload"));
const repairJob_controller_1 = require("../controllers/repairJob.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("CUSTOMER"), upload_1.default.single("image"), repairJob_controller_1.createRepairJob);
router.get("/my", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("CUSTOMER"), repairJob_controller_1.getMyRepairJobs);
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN"), repairJob_controller_1.getAllRepairJobs);
router.put("/:id/status", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN"), repairJob_controller_1.updateRepairJobStatus);
router.put("/:id/assign", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN"), repairJob_controller_1.assignStaff);
router.put("/:id/update", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("STAFF"), repairJob_controller_1.updateRepairJob);
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
exports.default = router;
