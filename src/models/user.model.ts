import mongoose, { Schema } from "mongoose";
import { Bird } from "./bird.model";
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

userSchema.pre("save", async function (next) {
  if (!this.activeBird) {
    const rookieBird = await Bird.findOne({ type: "rookie", lvl: 1 }).sort({
      createdAt: 1,
    });
    if (rookieBird) this.activeBird = rookieBird._id;
  }
  next();
});

export const User = mongoose.model("User", userSchema);
