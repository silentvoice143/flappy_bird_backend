import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    percentage: { type: Number, min: 0, max: 100, required: true }, // % off
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { _id: false } // prevent creating a separate _id for the subdocument
);

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

    isAvailable: {
      type: Boolean,
      default: true,
    },
    offer: {
      type: offerSchema,
      default: null,
    },
  },
  { timestamps: true }
);
storeItemSchema.index({ itemType: 1, isAvailable: 1 }); // common filter
storeItemSchema.index({ itemId: 1 }); // for populate lookups
storeItemSchema.index({ name: "text" }); // for search
storeItemSchema.index({ price: 1 }); // for sorting/filtering by price

export const StoreItem = mongoose.model("StoreItem", storeItemSchema);
