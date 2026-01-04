import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = (repairJob: any): string => {
  const invoicesDir = path.join(__dirname, "../../invoices");

  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir);
  }

  const filePath = path.join(
    invoicesDir,
    `invoice-${repairJob._id}.pdf`
  );

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  // ---------- HEADER ----------
  doc.fontSize(20).text("SMARTFIX REPAIR CENTER", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text("Repair Invoice", { align: "center" });
  doc.moveDown(2);

  // ---------- CUSTOMER INFO ----------
  doc.fontSize(12).text(`Customer Name: ${repairJob.customerName}`);
  doc.text(`Device Type: ${repairJob.deviceType}`);
  doc.text(`Issue: ${repairJob.problemDescription}`);
  doc.moveDown();

  // ---------- REPAIR DETAILS ----------
  doc.text(`Repair Status: ${repairJob.status}`);
  doc.text(`Technician: ${repairJob.technician || "Not Assigned"}`);
  doc.moveDown();

  // ---------- COST ----------
  doc.text(`Repair Cost: $${repairJob.repairCost || "Pending"}`);
  doc.moveDown();

  // ---------- AI DIAGNOSIS ----------
  if (repairJob.aiDiagnosis) {
    doc.fontSize(14).text("AI Diagnosis Summary");
    doc.moveDown(0.5);
    doc.fontSize(12).text(repairJob.aiDiagnosis.possibleCauses);
    doc.moveDown();
    doc.text(`Estimated Time: ${repairJob.aiDiagnosis.estimatedTime}`);
    doc.text(`Estimated Cost: ${repairJob.aiDiagnosis.estimatedCost}`);
    doc.text(`Priority Level: ${repairJob.aiDiagnosis.priorityLevel}`);
  }

  doc.moveDown(2);
  doc.text("Thank you for choosing SmartFix!", { align: "center" });

  doc.end();

  return filePath;
};
