import { Request, Response } from "express";
import Booking, { BookingStatus } from "../models/Booking";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * CUSTOMER → Create Booking
 * POST /api/bookings
 */
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { service, date } = req.body;

    if (!service || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = await Booking.create({
      customer: req.user!.id,
      service,
      date,
      status: BookingStatus.PENDING
    });

    res.status(201).json({
      message: "Booking request submitted",
      booking
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CUSTOMER → View My Bookings
 * GET /api/bookings/my
 */
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ customer: req.user!.id })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * STAFF / ADMIN → View All Bookings
 * GET /api/bookings
 */
export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * STAFF / ADMIN → Approve Booking
 * PUT /api/bookings/:id/approve
 */
export const approveBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = BookingStatus.APPROVED;
    await booking.save();

    res.status(200).json({
      message: "Booking approved",
      booking
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * STAFF / ADMIN → Reject Booking
 * PUT /api/bookings/:id/reject
 */
export const rejectBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = BookingStatus.REJECTED;
    await booking.save();

    res.status(200).json({
      message: "Booking rejected",
      booking
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
