import { Request, Response } from "express";

export const aiDiagnose = async (req: Request, res: Response) => {
  const { description, deviceType } = req.body;

  if (!description || !deviceType) {
    return res.status(400).json({ message: "Description and device type are required" });
  }

  // Simulate AI diagnosis + cost/time estimation
  let suggestion = "";
  let estimatedCost = 0;
  let estimatedTime = "";

  const desc = description.toLowerCase();

  // Simple rules
  if (desc.includes("screen")) {
    suggestion = "Screen replacement likely needed";
    estimatedCost = deviceType === "Phone" ? 100 : deviceType === "Laptop" ? 200 : 150;
    estimatedTime = "2-3 days";
  } else if (desc.includes("battery")) {
    suggestion = "Battery replacement recommended";
    estimatedCost = deviceType === "Phone" ? 50 : deviceType === "Laptop" ? 120 : 60;
    estimatedTime = "1-2 days";
  } else if (desc.includes("water")) {
    suggestion = "Device may have water damage, perform diagnostics";
    estimatedCost = deviceType === "Phone" ? 80 : deviceType === "Laptop" ? 150 : 100;
    estimatedTime = "3-5 days";
  } else {
    suggestion = "Further inspection required to diagnose the issue";
    estimatedCost = 50;
    estimatedTime = "2-4 days";
  }

  return res.json({ suggestion, estimatedCost, estimatedTime });
};