import mongoose, { Schema, Types } from "mongoose";
import { Bird, IBird } from "./bird.model";
import { ITier, Tier } from "./tier.model";
import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  profilePic?: string;
  isGoogleUser: boolean;
  phone?: string;
  password?: string;
  createdAt: Date;
  activeBird?: Types.ObjectId | IBird; // populated or ObjectId
  currentTier?: Types.ObjectId | ITier; // populated or ObjectId
  coin_earned: number;
  adsWatchedToday: {
    banner: number;
    interstitial: number;
    rewarded: number;
  };
}
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "super_admin"],
    default: "user",
  },
  profilePic: {
    type: String,
    default: "",
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "12345678",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  activeBird: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bird",
    default: null,
  },
  currentTier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tier",
    default: null,
  },
  coin_earned: {
    type: Number,
    required: true,
    default: 0,
  },
  adsWatchedToday: {
    banner: { type: Number, default: 0 },
    interstitial: { type: Number, default: 0 },
    rewarded: { type: Number, default: 0 },
  },
});

userSchema.pre("save", async function (next) {
  if (this.isNew && !this.activeBird) {
    const rookieBird = await Bird.findOne({ type: "rookie", lvl: 1 }).sort({
      createdAt: 1,
    });
    const rookieTier = await Tier.findOne({
      category: "Rookie",
      level: 1,
      overall_order: 1,
    });

    if (rookieBird) this.activeBird = rookieBird._id;
    if (rookieTier) this.currentTier = rookieTier._id;
  }
  next();
});

export const User = mongoose.model("User", userSchema);
