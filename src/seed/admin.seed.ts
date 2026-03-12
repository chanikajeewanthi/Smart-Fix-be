import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User, { Role } from "../models/User";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const adminEmail = "admin@smartfix.com";

    const exists = await User.findOne({ email: adminEmail });
    if (exists) {
      console.log(" Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "System Admin",
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    console.log(" Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error(" Admin seed failed:", err);
    process.exit(1);
  }
};

seedAdmin();
