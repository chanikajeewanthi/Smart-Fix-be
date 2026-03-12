import { Request, Response } from "express";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import jwt, { SignOptions } from "jsonwebtoken";
import User, { Role } from "../models/User";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwt";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: Role.CUSTOMER
  });

 const payload = { id: user._id, role: user.role };
 const options: SignOptions = {
  expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] || "1d",
};

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, options);
  res.status(201).json({ token, user });
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

 const payload = { id: user._id, role: user.role };
     const options: SignOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] || "1d",
  };


    const token = jwt.sign(payload, process.env.JWT_SECRET as string, options);

  res.json({ token, user });
};

