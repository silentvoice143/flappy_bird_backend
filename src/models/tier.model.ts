import mongoose from "mongoose";

const tierSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    min_exp_required: {
      type: Number,
      required: true,
    },
    tier_multiplier: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: 0.2,
    },
  },
  { timestamps: true }
);

export const Tier = mongoose.model("Tier", tierSchema);
