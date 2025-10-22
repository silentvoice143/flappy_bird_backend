import mongoose, { Document } from "mongoose";

// Interface for Bird document
export interface IBird extends Document {
  name: string;
  type: "rookie" | "pro" | "elite";
  lvl: number;
  multiplier: number;
  imageUrl?: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const birdSchema = new mongoose.Schema(
  {
    // A unique name for the bird
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["rookie", "pro", "elite"],
      required: true,
      default: "rookie",
    },
    lvl: {
      type: Number,
      default: 1,
    },
    multiplier: {
      type: Number,
      required: true,
      min: 1,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Bird = mongoose.model("Bird", birdSchema);
