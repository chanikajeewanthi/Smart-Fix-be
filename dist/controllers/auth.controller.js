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
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import jwt from "jsonwebtoken";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importStar(require("../models/User"));
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }
    const exists = await User_1.default.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: "Email already exists" });
    }
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await User_1.default.create({
        name,
        email,
        password: hashed,
        role: User_1.Role.CUSTOMER
    });
    const payload = { id: user._id, role: user.role };
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, options);
    res.status(201).json({ token, user });
};
exports.register = register;
// export const register = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password, role } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields required" });
//     }
//     const exists = await User.findOne({ email });
//     if (exists) {
//       return res.status(400).json({ message: "Email already exists" });
//     }
//     // Default role is CUSTOMER
//     let userRole = Role.CUSTOMER;
//     // Only ADMIN can create STAFF or ADMIN accounts
//     if (role && (role === Role.ADMIN || role === Role.STAFF)) {
//       // Check if the requester is an admin
//       const requester = (req as any).user;
//       if (!requester || requester.role !== Role.ADMIN) {
//         return res.status(403).json({ message: "Only admins can assign this role" });
//       }
//       userRole = role;
//     }
//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name,
//       email,
//       password: hashed,
//       role: userRole,
//     });
//     const payload = { id: user._id, role: user.role };
//     const options: SignOptions = {
//   expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] || "1d",
// };
//     const token = jwt.sign(payload, process.env.JWT_SECRET as string, options);
//     res.status(201).json({ token, user });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match)
        return res.status(401).json({ message: "Invalid credentials" });
    const payload = { id: user._id, role: user.role };
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, options);
    res.json({ token, user });
};
exports.login = login;
