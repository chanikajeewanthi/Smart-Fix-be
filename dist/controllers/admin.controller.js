"use strict";
// import { Request, Response } from "express"
// import User from "../models/User"
// import Booking, { BookingStatus } from "../models/Booking"
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookingsAdmin = exports.getAllUsers = exports.getAdminDashboardStats = void 0;
const User_1 = __importDefault(require("../models/User"));
const Booking_1 = __importDefault(require("../models/Booking"));
// ── Lightweight stats for dashboard ──
const getAdminDashboardStats = async (_req, res) => {
    try {
        const [totalUsers, totalStaff, totalCustomers, totalBookings, statusCounts] = await Promise.all([
            User_1.default.countDocuments(),
            User_1.default.countDocuments({ role: "STAFF" }),
            User_1.default.countDocuments({ role: "CUSTOMER" }),
            Booking_1.default.countDocuments(),
            Booking_1.default.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);
        const bookingsByStatus = statusCounts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, { PENDING: 0, APPROVED: 0, REJECTED: 0, COMPLETED: 0 });
        res.status(200).json({
            users: {
                total: totalUsers,
                customers: totalCustomers,
                staff: totalStaff,
            },
            bookings: {
                total: totalBookings,
                ...bookingsByStatus,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};
exports.getAdminDashboardStats = getAdminDashboardStats;
// ── Full list – use only on list pages ──
const getAllUsers = async (_req, res) => {
    try {
        const users = await User_1.default.find()
            .select("-password -__v -resetPasswordToken -resetPasswordExpire")
            .lean();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllUsers = getAllUsers;
const getAllBookingsAdmin = async (_req, res) => {
    try {
        const bookings = await Booking_1.default.find()
            .populate("customer", "name email")
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllBookingsAdmin = getAllBookingsAdmin;
// You can add more later: createStaff, updateUser, deleteUser, updateBookingStatus, etc.
