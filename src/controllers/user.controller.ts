import { Request, Response } from "express";
import { User, IUser } from "../models/user.model";
import mongoose from "mongoose";

// 📌 Get user details by ID
export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid user ID" });

    const user = await User.findById(userId)
      .populate("activeBird")
      .populate("currentTier");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Update user info (name, phone, profilePic)
export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, phone, profilePic } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid user ID" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profilePic) user.profilePic = profilePic;

    await user.save();
    res.status(200).json({ message: "User info updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Increment ads watched count
export const incrementAdsWatched = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { type, count = 1 } = req.body; // type = "banner" | "interstitial" | "rewarded"

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid user ID" });

    if (!["banner", "interstitial", "rewarded"].includes(type))
      return res.status(400).json({ message: "Invalid ad type" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Increment the corresponding ad type
    user.adsWatchedToday = user.adsWatchedToday ?? {
      banner: 0,
      interstitial: 0,
      rewarded: 0,
    };
    user.adsWatchedToday[type as keyof IUser["adsWatchedToday"]] += count;
    await user.save();

    res.status(200).json({
      message: `${type} ads count incremented`,
      adsWatchedToday: user.adsWatchedToday,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
