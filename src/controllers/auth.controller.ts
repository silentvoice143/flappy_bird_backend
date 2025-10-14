import { Request, Response } from "express";

import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken.utils";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  const { idToken } = req.body;
  console.log("api hit", process.env.GOOGLE_CLIENT_ID, "---id");

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = await ticket.getPayload();
  if (!payload || !payload.email) {
    return res.status(401).json({ message: "Invalid Google token" });
  }

  const { email, name, picture } = payload;

  // Find user by email
  let user: any = await User.findOne({ email });

  if (!user) {
    // Create user if doesn't exist
    user = new User({
      name,
      email,
      profilePic: picture,
      isGoogleUser: true,
      phone: "",
      today_coin_earned: 0,
    });
    await user.save();
  }

  const token = generateToken(user);

  return res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        id: user?._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        today_coin_earned: user.today_coin_earned || 0,
      },
    },
  });
};

export const passwordLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user: any = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        profilePic: user.profilePic,
        today_coin_earned: user.today_coin_earned || 0,
      },
    },
  });
};

export const passwordSignup = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required" });
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user: any = await User.create({
    name,
    email,
    password: hashedPassword,
    phone: phone || "",
    isGoogleUser: false,
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    },
  });
};
