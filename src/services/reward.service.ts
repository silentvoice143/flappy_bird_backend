import { User } from "../models/user.model";

export const calculateDailyRewardIfNotGiven = async (
  user: typeof User.prototype
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stat = user.dailyStats.find(
    (s: any) => new Date(s.date).getTime() === today.getTime()
  );

  if (!stat || stat.coinsAwarded !== undefined) return;

  const adRevenue = stat.games * 0.3; // ₹0.50 per game
  const rawReward = stat.score * 0.05 + stat.games * 1;
  const maxReward = adRevenue * 2; // ₹ -> coins (1₹ = 100 coins)

  const finalReward = Math.floor(Math.min(rawReward, maxReward));
  user.totalCoins += finalReward;
  stat.coinsAwarded = finalReward;

  await user.save();
};
