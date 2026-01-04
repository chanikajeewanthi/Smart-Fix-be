import mongoose, { Schema, Document } from "mongoose";

export enum BookingStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId;
  service: string;
  date: Date;
  status: BookingStatus;
}

const bookingSchema = new Schema<IBooking>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING
    }
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", bookingSchema);
