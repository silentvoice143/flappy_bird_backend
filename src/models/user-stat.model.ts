import mongoose, { Mongoose } from "mongoose";

const userStatSchema = new mongoose.Schema({
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
  best_score: {
    type: Number,
    required: true,
    default: 0,
  },
  highest_tier_reached: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
});

export const UserStat = mongoose.model("UserStat", userStatSchema);
