import { Schema, model, Document } from "mongoose";

export interface IGame extends Document {
  userId: Schema.Types.ObjectId;
  status: "in-progress" | "end";
  score: number;
  duration: number; // in seconds
  startedAt: Date;
  endedAt: Date;
  coinsEarned: number;
  adsViewed: number;
  createdAt: Date;
  season: Schema.Types.ObjectId;
}

const gameSchema = new Schema<IGame>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["in-progress", "end"],
      default: "in-progress",
    },
    score: { type: Number, required: true },
    duration: { type: Number, required: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    coinsEarned: { type: Number, default: 0 },
    adsViewed: { type: Number, default: 0 },
    season: {
      type: Schema.Types.ObjectId,
      ref: "Season",
      default: null,
    },
  },
  { timestamps: true }
);

export const Game = model<IGame>("Game", gameSchema);
