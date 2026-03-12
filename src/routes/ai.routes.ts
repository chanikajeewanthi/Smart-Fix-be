import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { aiDiagnose } from "../controllers/ai.controller";

const router = express.Router();

// Only logged-in users
router.post("/ai-diagnose", authenticate, aiDiagnose);

export default router;