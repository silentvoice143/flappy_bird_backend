import mongoose, { Schema } from "mongoose";
const userItemSchema = new Schema(
  {
    storeItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "StoreItem",
    },
    purchased_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isEquipped: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("UserItem", userItemSchema);
