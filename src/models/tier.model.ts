import mongoose, { Document } from "mongoose";

export interface ITier extends Document {
  category: "Rookie" | "Pro" | "Elite" | "Legend"; // matches schema enum
  level: number;
  title: string;
  min_score: number;
  max_score: number;
  tier_multiplier: number;
  overall_order: number;
  color?: string;
  badge_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tierSchema = new mongoose.Schema(
  {
    // Main Tier Category (e.g., "Rookie", "Pro", "Elite")
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["Rookie", "Pro", "Elite", "Legend"], // add more if needed
    },

    // Sub level inside the category (e.g., 1, 2, 3)
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 10, // can adjust depending on how many sub-levels you want
    },

    // Full title: "Rookie 1", "Pro 2", etc.
    title: {
      type: String,
      required: true,
      unique: true,
    },

    // score required to reach this sub-tier
    min_score: {
      type: Number,
      required: true,
    },
    max_score: {
      type: Number,
      required: true,
    },

    // Multiplier or bonus for this specific sub-tier
    tier_multiplier: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 1,
    },

    // Used for sorting overall
    overall_order: {
      type: Number,
      required: true,
      unique: true,
    },

    // Optional UI/metadata
    color: String,
    badge_url: String,
  },
  { timestamps: true }
);

export const Tier = mongoose.model("Tier", tierSchema);
