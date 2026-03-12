
import { Request, Response } from "express";
import RepairJob, { RepairStatus } from "../models/RepairJob";
import cloudinary from "../config/cloudinary";


export const createRepairJob = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { serviceType, problemDescription } = req.body;

    if (!serviceType || !problemDescription) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl: string | undefined;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "repair-jobs",
        }
      );
      imageUrl = uploadResult.secure_url;
    }

    const repairJob = await RepairJob.create({
      customer: user.id,
      serviceType,
      problemDescription,
      image: imageUrl,
    });

    res.status(201).json({
      message: "Repair request submitted",
      data: repairJob,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyRepairJobs = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const jobs = await RepairJob.find({ customer: user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(jobs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


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


export const updateRepairJobStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (
      status !== RepairStatus.APPROVED &&
      status !== RepairStatus.REJECTED
    ) {
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
      message: "Repair job status updated",
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const assignStaff = async (req: Request, res: Response) => {
  try {
    const { staffId } = req.body;
    const { id } = req.params;

    const job = await RepairJob.findByIdAndUpdate(
      id,
      { assignedStaff: staffId },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Repair job not found" });
    }

    res.status(200).json({
      message: "Staff assigned",
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


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
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// export const generateInvoice = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const job = await RepairJob.findById(id);
//     if (!job) {
//       return res.status(404).json({ message: "Repair job not found" });
//     }

//     const pdfPath = generateInvoicePDF(job);
//     res.download(pdfPath);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
