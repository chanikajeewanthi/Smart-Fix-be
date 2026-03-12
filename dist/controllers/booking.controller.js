"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectBooking = exports.approveBooking = exports.getAllBookings = exports.getMyBookings = exports.createBooking = void 0;
const Booking_1 = __importStar(require("../models/Booking"));
/**
 * CUSTOMER → Create Booking
 * POST /api/bookings
 */
const createBooking = async (req, res) => {
    try {
        const { service, date } = req.body;
        if (!service || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const booking = await Booking_1.default.create({
            customer: req.user.id,
            service,
            date,
            status: Booking_1.BookingStatus.PENDING
        });
        res.status(201).json({
            message: "Booking request submitted",
            booking
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createBooking = createBooking;
/**
 * CUSTOMER → View My Bookings
 * GET /api/bookings/my
 */
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking_1.default.find({ customer: req.user.id })
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMyBookings = getMyBookings;
/**
 * STAFF / ADMIN → View All Bookings
 * GET /api/bookings
 */
const getAllBookings = async (_req, res) => {
    try {
        const bookings = await Booking_1.default.find()
            .populate("customer", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllBookings = getAllBookings;
/**
 * STAFF / ADMIN → Approve Booking
 * PUT /api/bookings/:id/approve
 */
const approveBooking = async (req, res) => {
    try {
        const booking = await Booking_1.default.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        booking.status = Booking_1.BookingStatus.APPROVED;
        await booking.save();
        res.status(200).json({
            message: "Booking approved",
            booking
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.approveBooking = approveBooking;
/**
 * STAFF / ADMIN → Reject Booking
 * PUT /api/bookings/:id/reject
 */
const rejectBooking = async (req, res) => {
    try {
        const booking = await Booking_1.default.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        booking.status = Booking_1.BookingStatus.REJECTED;
        await booking.save();
        res.status(200).json({
            message: "Booking rejected",
            booking
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.rejectBooking = rejectBooking;
