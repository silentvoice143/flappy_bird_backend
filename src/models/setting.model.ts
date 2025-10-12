import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  notification: {
    type: Boolean,
    default: true,
  },
  volume: {
    type: Number,
    default: 5,
    min: 0,
    max: 10,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export const UserSetting = mongoose.model("Setting", settingSchema);
