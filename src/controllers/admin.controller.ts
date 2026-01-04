// import { Request, Response } from "express";
// import User from "../models/User";
// import Booking, { BookingStatus } from "../models/Booking";

// /**
//  * ADMIN → Dashboard Statistics
//  * GET /api/admin/stats
//  */
// export const getAdminStats = async (_req: Request, res: Response) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const totalBookings = await Booking.countDocuments();

//     const pendingBookings = await Booking.countDocuments({
//       status: BookingStatus.PENDING
//     });

//     const approvedBookings = await Booking.countDocuments({
//       status: BookingStatus.APPROVED
//     });

//     const rejectedBookings = await Booking.countDocuments({
//       status: BookingStatus.REJECTED
//     });

//     res.status(200).json({
//       totalUsers,
//       totalBookings,
//       bookings: {
//         pending: pendingBookings,
//         approved: approvedBookings,
//         rejected: rejectedBookings
//       }
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * ADMIN → View All Users
//  * GET /api/admin/users
//  */
// export const getAllUsers = async (_req: Request, res: Response) => {
//   try {
//     const users = await User.find().select("-password");
//     res.status(200).json(users);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * ADMIN / STAFF → View All Bookings
//  * GET /api/admin/bookings
//  */
// export const getAllBookingsAdmin = async (_req: Request, res: Response) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("customer", "name email role")
//       .sort({ createdAt: -1 });

//     res.status(200).json(bookings);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };



import { Request, Response } from "express";
import User from "../models/User";
import { RepairJob } from "../models/RepairJob";

/**
 * ADMIN – Get all users
 * GET /api/admin/users
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN – Approve or Reject staff
 * PUT /api/admin/users/:id/status
 */
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User ${status.toLowerCase()}`,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN – System dashboard analytics
 * GET /api/admin/dashboard
 */
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await RepairJob.countDocuments();
    const pendingJobs = await RepairJob.countDocuments({ status: "PENDING" });
    const completedJobs = await RepairJob.countDocuments({ status: "COMPLETED" });

    res.status(200).json({
      totalUsers,
      totalJobs,
      pendingJobs,
      completedJobs
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
