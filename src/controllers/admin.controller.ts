import { Request, Response } from "express";
import RepairJob from "../models/RepairJob";
import User from "../models/User";

// Get all repair jobs
export const getAllRepairJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await RepairJob.find().populate("customer", "name email");
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update repair job status (APPROVED / REJECTED / COMPLETED)
export const updateRepairJobStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  try {
    const job = await RepairJob.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get admin stats
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRequests = await RepairJob.countDocuments();
    const pendingRequests = await RepairJob.countDocuments({ status: "PENDING" });
    const approvedRequests = await RepairJob.countDocuments({ status: "APPROVED" });
    const completedRequests = await RepairJob.countDocuments({ status: "COMPLETED" });

    res.json({
      totalUsers,
      totalRequests,
      pendingRequests,
      approvedRequests,
      completedRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};