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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRepairJob = exports.assignStaff = exports.updateRepairJobStatus = exports.getAllRepairJobs = exports.getMyRepairJobs = exports.createRepairJob = void 0;
const RepairJob_1 = __importStar(require("../models/RepairJob"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const createRepairJob = async (req, res) => {
    try {
        const user = req.user;
        const { serviceType, problemDescription } = req.body;
        if (!serviceType || !problemDescription) {
            return res.status(400).json({ message: "All fields are required" });
        }
        let imageUrl;
        if (req.file) {
            const uploadResult = await cloudinary_1.default.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`, {
                folder: "repair-jobs",
            });
            imageUrl = uploadResult.secure_url;
        }
        const repairJob = await RepairJob_1.default.create({
            customer: user.id,
            serviceType,
            problemDescription,
            image: imageUrl,
        });
        res.status(201).json({
            message: "Repair request submitted",
            data: repairJob,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createRepairJob = createRepairJob;
const getMyRepairJobs = async (req, res) => {
    try {
        const user = req.user;
        const jobs = await RepairJob_1.default.find({ customer: user.id }).sort({
            createdAt: -1,
        });
        res.status(200).json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMyRepairJobs = getMyRepairJobs;
const getAllRepairJobs = async (_req, res) => {
    try {
        const jobs = await RepairJob_1.default.find()
            .populate("customer", "name email")
            .populate("assignedStaff", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllRepairJobs = getAllRepairJobs;
const updateRepairJobStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        if (status !== RepairJob_1.RepairStatus.APPROVED &&
            status !== RepairJob_1.RepairStatus.REJECTED) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const job = await RepairJob_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!job) {
            return res.status(404).json({ message: "Repair job not found" });
        }
        res.status(200).json({
            message: "Repair job status updated",
            data: job,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateRepairJobStatus = updateRepairJobStatus;
const assignStaff = async (req, res) => {
    try {
        const { staffId } = req.body;
        const { id } = req.params;
        const job = await RepairJob_1.default.findByIdAndUpdate(id, { assignedStaff: staffId }, { new: true });
        if (!job) {
            return res.status(404).json({ message: "Repair job not found" });
        }
        res.status(200).json({
            message: "Staff assigned",
            data: job,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.assignStaff = assignStaff;
const updateRepairJob = async (req, res) => {
    try {
        const { notes, finalCost, status } = req.body;
        const { id } = req.params;
        const job = await RepairJob_1.default.findByIdAndUpdate(id, { notes, finalCost, status }, { new: true });
        if (!job) {
            return res.status(404).json({ message: "Repair job not found" });
        }
        res.status(200).json({
            message: "Repair job updated",
            data: job,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateRepairJob = updateRepairJob;
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
