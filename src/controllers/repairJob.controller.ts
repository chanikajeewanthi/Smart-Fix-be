import { Request, Response } from "express";
import { RepairJob, RepairStatus } from "../models/RepairJob";
import { getAIDiagnosis } from "../services/aiDiagnosis.service";
import { generateInvoicePDF } from "../utils/invoiceGenerator";

/**
 * CUSTOMER – Create repair request
 * POST /api/repair-jobs
 */
export const createRepairJob = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const { serviceType, problemDescription } = req.body;

    if (!serviceType || !problemDescription) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const repairJob = await RepairJob.create({
      customer: user.id,
      serviceType,
      problemDescription
    });

    res.status(201).json({
      message: "Repair request submitted",
      data: repairJob
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CUSTOMER – View own repair jobs
 * GET /api/repair-jobs/my
 */
export const getMyRepairJobs = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const jobs = await RepairJob.find({ customer: user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN – View all repair jobs
 * GET /api/repair-jobs
 */
export const getAllRepairJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await RepairJob.find()
      .populate("customer", "name email")
      .populate("assignedStaff", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN – Approve or Reject repair job
 * PUT /api/repair-jobs/:id/status
 */
export const updateRepairJobStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (![RepairStatus.APPROVED, RepairStatus.REJECTED].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const job = await RepairJob.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Repair job not found" });
    }

    res.status(200).json({
      message: `Repair job ${status.toLowerCase()}`,
      data: job
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN – Assign staff
 * PUT /api/repair-jobs/:id/assign
 */
export const assignStaff = async (req: Request, res: Response) => {
  try {
    const { staffId } = req.body;
    const { id } = req.params;

    const job = await RepairJob.findByIdAndUpdate(
      id,
      {
        assignedStaff: staffId,
        status: RepairStatus.IN_PROGRESS
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Repair job not found" });
    }

    res.status(200).json({
      message: "Staff assigned",
      data: job
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * STAFF – Update repair job
 * PUT /api/repair-jobs/:id/update
 */
export const updateRepairJob = async (req: Request, res: Response) => {
  try {
    const { notes, finalCost, status } = req.body;
    const { id } = req.params;

    const job = await RepairJob.findByIdAndUpdate(
      id,
      { notes, finalCost, status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Repair job not found" });
    }

    res.status(200).json({
      message: "Repair job updated",
      data: job
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN – Generate AI diagnosis
 * POST /api/repair-jobs/:id/ai-diagnosis
 */
export const generateAIDiagnosis = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await RepairJob.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Repair job not found" });
    }

    const aiResult = await getAIDiagnosis(job.problemDescription);

    job.aiDiagnosis = aiResult;
    await job.save();

    res.status(200).json({
      message: "AI diagnosis generated",
      data: aiResult
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN – Generate PDF Invoice
 * GET /api/repair-jobs/:id/invoice
 */
export const generateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await RepairJob.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Repair job not found" });
    }

    const pdfPath = generateInvoicePDF(job);

    res.download(pdfPath);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

