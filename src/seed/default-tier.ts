import { Tier } from "../models/tier.model";

export const ensureDefaultTier = async () => {
  // Check if any bird with type "rookie" exists
  let tier = await Tier.findOne({ title: "Broze" });

  if (!tier) {
    // If not, create a default rookie bird
    tier = new Tier({
      title: "Broze",
      min_exp_required: 0,
      tier_multiplier: 1,
      lvl: 1,
    });

    await tier.save();
    console.log("Default tier created:", tier._id);
  } else {
    console.log("Tier already exists:", tier._id);
  }

  return tier; // return the rookie bird for convenience
};
