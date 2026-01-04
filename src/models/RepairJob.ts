// import mongoose, { Schema, Document } from "mongoose";

// export interface IRepairJob extends Document {
//   serviceRequestId: mongoose.Types.ObjectId;
//   assignedStaffId: mongoose.Types.ObjectId;
//   repairNotes?: string;
//   estimatedCost?: number;
//   actualCost?: number;
//   repairStatus: "STARTED" | "IN_PROGRESS" | "READY" | "DELIVERED";
// }

// const RepairJobSchema = new Schema(
//   {
//     serviceRequestId: {
//       type: Schema.Types.ObjectId,
//       ref: "ServiceRequest",
//       required: true
//     },
//     assignedStaffId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     repairNotes: String,
//     estimatedCost: Number,
//     actualCost: Number,
//     repairStatus: {
//       type: String,
//       enum: ["STARTED", "IN_PROGRESS", "READY", "DELIVERED"],
//       default: "STARTED"
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IRepairJob>("RepairJob", RepairJobSchema);


import mongoose, { Schema, Document } from "mongoose";

export enum RepairStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

export interface IRepairJob extends Document {
  customer: mongoose.Types.ObjectId;
  assignedStaff?: mongoose.Types.ObjectId;
  serviceType: string;
  problemDescription: string;

  // AI Diagnosis
  aiDiagnosis?: {
    possibleCauses: string;
    estimatedTime: string;
    estimatedCost: string;
    priorityLevel: string;
  };

  status: RepairStatus;
  finalCost?: number;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const repairJobSchema = new Schema<IRepairJob>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignedStaff: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    serviceType: {
      type: String,
      required: true
    },

    problemDescription: {
      type: String,
      required: true
    },

    aiDiagnosis: {
      possibleCauses: String,
      estimatedTime: String,
      estimatedCost: String,
      priorityLevel: String
    },

    status: {
      type: String,
      enum: Object.values(RepairStatus),
      default: RepairStatus.PENDING
    },

    finalCost: {
      type: Number
    },

    notes: {
      type: String
    }
  },
  { timestamps: true }
);

export const RepairJob = mongoose.model<IRepairJob>(
  "RepairJob",
  repairJobSchema
);
