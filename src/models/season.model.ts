import mongoose, { Document, Model } from "mongoose";

export interface ISeason extends Document {
  title: string;
  startDate: Date;
  endDate: Date;
  status: "upcoming" | "active" | "ended";
  rewards: mongoose.Types.ObjectId[];
  tiers: mongoose.Types.ObjectId[];
}

interface SeasonModel extends Model<ISeason> {
  updateSeasonStatuses(): Promise<void>;
}

const seasonSchema = new mongoose.Schema<ISeason>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
      // ✅ fix: use `function(this: ISeason, value: Date)` to give proper `this` type
      validate: {
        validator: function (this: ISeason, value: Date): boolean {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "ended"],
      default: "upcoming",
    },
    rewards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reward",
        default: null,
      },
    ],
  },
  { timestamps: true }
);

// Indexing
seasonSchema.index({ startDate: 1, endDate: 1 });

// Static method
seasonSchema.statics.updateSeasonStatuses = async function (): Promise<void> {
  const now = new Date();

  await this.updateMany(
    {
      startDate: { $lte: now },
      endDate: { $gt: now },
      status: { $ne: "active" },
    },
    { $set: { status: "active" } }
  );

  await this.updateMany(
    { endDate: { $lte: now }, status: { $ne: "ended" } },
    { $set: { status: "ended" } }
  );

  await this.updateMany(
    { startDate: { $gt: now }, status: { $ne: "upcoming" } },
    { $set: { status: "upcoming" } }
  );
};

export const Season = mongoose.model<ISeason, SeasonModel>(
  "Season",
  seasonSchema
);
