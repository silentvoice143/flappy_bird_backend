import mongoose from "mongoose";

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
