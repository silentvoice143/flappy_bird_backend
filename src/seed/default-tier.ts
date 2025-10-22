import { Tier } from "../models/tier.model";

export const ensureDefaultTier = async () => {
  const count = await Tier.countDocuments();

  if (count === 0) {
    console.log("⚙️  No tiers found, creating default tier set...");

    const defaultTiers = [
      // Rookie tiers
      {
        category: "Rookie",
        level: 1,
        min_score: 0,
        max_score: 499,
        tier_multiplier: 1.0,
        overall_order: 1,
      },
      {
        category: "Rookie",
        level: 2,
        min_score: 500,
        max_score: 999,
        tier_multiplier: 1.1,
        overall_order: 2,
      },
      {
        category: "Rookie",
        level: 3,
        min_score: 1000,
        max_score: 1499,
        tier_multiplier: 1.2,
        overall_order: 3,
      },

      // Pro tiers
      {
        category: "Pro",
        level: 1,
        min_score: 1500,
        max_score: 1999,
        tier_multiplier: 1.3,
        overall_order: 4,
      },
      {
        category: "Pro",
        level: 2,
        min_score: 2000,
        max_score: 2499,
        tier_multiplier: 1.4,
        overall_order: 5,
      },
      {
        category: "Pro",
        level: 3,
        min_score: 2500,
        max_score: 2999,
        tier_multiplier: 1.5,
        overall_order: 6,
      },

      // Elite tiers
      {
        category: "Elite",
        level: 1,
        min_score: 3000,
        max_score: 3499,
        tier_multiplier: 1.6,
        overall_order: 7,
      },
      {
        category: "Elite",
        level: 2,
        min_score: 3500,
        max_score: 3999,
        tier_multiplier: 1.8,
        overall_order: 8,
      },
      {
        category: "Elite",
        level: 3,
        min_score: 4000,
        max_score: 4499,
        tier_multiplier: 2.0,
        overall_order: 9,
      },
    ];

    // Add titles
    const withTitles = defaultTiers.map((t) => ({
      ...t,
      title: `${t.category} ${t.level}`,
    }));

    const created = await Tier.insertMany(withTitles);
    console.log(`✅ Default tiers created: ${created.length}`);
    return created;
  } else {
    console.log(`ℹ️  ${count} tiers already exist. Skipping default seeding.`);
    return await Tier.find().sort({ overall_order: 1 });
  }
};
