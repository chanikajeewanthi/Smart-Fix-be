
import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register); 
router.post("/login", login);
router.post("/register/admin", authenticate, authorize("ADMIN")); 

export default router;

