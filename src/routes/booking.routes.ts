import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  approveBooking,
  rejectBooking
} from "../controllers/booking.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { Role } from "../models/User";

const router = Router();

// Customer
router.post("/", authenticate, authorize(Role.CUSTOMER), createBooking);
router.get("/my", authenticate, authorize(Role.CUSTOMER), getMyBookings);

// Staff / Admin
router.get("/", authenticate, authorize(Role.STAFF, Role.ADMIN), getAllBookings);
router.put("/:id/approve", authenticate, authorize(Role.STAFF, Role.ADMIN), approveBooking);
router.put("/:id/reject", authenticate, authorize(Role.STAFF, Role.ADMIN), rejectBooking);

export default router;
