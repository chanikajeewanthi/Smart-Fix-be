import mongoose, { Schema, Document } from "mongoose";

export enum Role {
  CUSTOMER = "CUSTOMER",
  STAFF = "STAFF",
  ADMIN = "ADMIN"
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.CUSTOMER
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
