"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepairStatus = void 0;
const mongoose_1 = require("mongoose");
var RepairStatus;
(function (RepairStatus) {
    RepairStatus["PENDING"] = "PENDING";
    RepairStatus["APPROVED"] = "APPROVED";
    RepairStatus["COMPLETED"] = "COMPLETED";
    RepairStatus["REJECTED"] = "REJECTED";
})(RepairStatus || (exports.RepairStatus = RepairStatus = {}));
const repairJobSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("RepairJob", repairJobSchema);
