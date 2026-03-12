import { Schema, model, Document, Types } from "mongoose";

export enum RepairStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED"
}

export interface IRepairJob extends Document {
  customer: Types.ObjectId;
  serviceType: string;
  problemDescription: string;
  image?: string;
  status: RepairStatus;
  createdAt: Date;
}

const repairJobSchema = new Schema<IRepairJob>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    problemDescription: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(RepairStatus),
      default: RepairStatus.PENDING,
    },
  },
  { timestamps: true }
);

export default model<IRepairJob>("RepairJob", repairJobSchema);


