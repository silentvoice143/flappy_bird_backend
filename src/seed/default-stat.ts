import { User } from "../models/user.model";
import { UserStat } from "../models/user-stat.model";
import { Season } from "../models/season.model";

export const createStatsForNewSeason = async () => {
  const now = new Date();

  // Find the active season
  const activeSeason = await Season.findOne({
    startDate: { $lte: now },
    endDate: { $gte: now },
  });

  if (!activeSeason) return;

  const users = await User.find();

  for (const user of users) {
    // Skip if user already has stats for this season
    const existing = await UserStat.findOne({
      user: user._id,
      season: activeSeason._id,
    });

    if (!existing) {
      await UserStat.create({
        user: user._id,
        season: activeSeason._id,
        highest_tier_reached: user.currentTier, // carry current tier
      });
      console.log(
        `✅ Created UserStat for user ${user._id} for season ${activeSeason._id}`
      );
    }
  }
};
