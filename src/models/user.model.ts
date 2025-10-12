import mongoose, { Schema } from "mongoose";
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
  today_coin_earned: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const User = mongoose.model("User", userSchema);
