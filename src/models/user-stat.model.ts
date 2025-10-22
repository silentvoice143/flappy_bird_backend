import mongoose, { Mongoose, Types } from "mongoose";
import { IUser } from "./user.model";
import { ISeason } from "./season.model";
import { ITier } from "./tier.model";

export interface IUserStat extends Document {
  user: Types.ObjectId | IUser;
  season: Types.ObjectId | ISeason;
  total_game_played: number;
  total_ads_watched: number;
  total_coin_earned: number;
  score: number;
  best_score: number;
  highest_tier_reached?: Types.ObjectId | ITier;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

const userStatSchema = new mongoose.Schema(
  {
    season: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Season",
    },
    total_game_played: {
      type: Number,
      required: true,
      default: 0,
    },
    total_ads_watched: {
      type: Number,
      required: true,
      default: 0,
    },
    total_coin_earned: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    best_score: {
      type: Number,
      required: true,
      default: 0,
    },
    highest_tier_reached: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

userStatSchema.index({ user: 1, season: 1 }, { unique: true });

// Optional pre-save hook to initialize highest tier
userStatSchema.pre("save", async function (next) {
  if (!this.highest_tier_reached) {
    const user = await mongoose.model("User").findById(this.user);
    if (user && user.currentTier) this.highest_tier_reached = user.currentTier;
  }
  next();
});

export const UserStat = mongoose.model("UserStat", userStatSchema);
