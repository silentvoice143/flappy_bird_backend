import mongoose from "mongoose";

const storeItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    itemType: {
      type: String,
      required: true,
      enum: ["Bird"],
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // The 'refPath' dynamically tells Mongoose which model to reference
      refPath: "itemType",
    },
    // Common metadata
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const StoreItem = mongoose.model("StoreItem", storeItemSchema);
