import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import repairJobRoutes from "./routes/repairJob.routes";
import bookingRoutes from "./routes/booking.routes";
import adminRoutes from "./routes/admin.routes";
import aiRoutes from "./routes/admin.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/repair-jobs", repairJobRoutes);
app.use("/api/ai-diagnose", aiRoutes);

export default app;


