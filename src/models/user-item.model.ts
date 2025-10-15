import mongoose, { Schema } from "mongoose";

const userItemSchema = new Schema(
  {
    storeItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "StoreItem",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    purchased_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    isEquipped: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// Optional: indexes for faster queries
userItemSchema.index({ user: 1, storeItem: 1 }, { unique: true }); // prevent duplicates
userItemSchema.index({ user: 1, isEquipped: 1 }); // fast lookup for equipped items

export const UserItem = mongoose.model("UserItem", userItemSchema);
