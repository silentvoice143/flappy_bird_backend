import cron from "node-cron";
import { User } from "../models/user.model";
import { Game } from "../models/game.model";

// Conversion rate
const POINTS_TO_COINS = 10; // 10 points = 1 coin
const MAX_SCORE = 1000; // max score used for scaling
const AD_EARNING_FRACTION = 0.4; // max fraction of scaled ad earnings

export const dailyRewardCron = () => {
  cron.schedule("* * * * *", async () => {
    console.log("🌙 Running daily reward cron job...");

    try {
      const users = await User.find();

      for (const user of users) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // 1️⃣ Total score from today's games
        const games = await Game.find({
          user: user._id,
          createdAt: { $gte: startOfDay },
        });

        const totalScore = games.reduce((sum, g) => sum + g.score, 0);

        // 2️⃣ Estimate ad earnings
        const ads = user.adsWatchedToday ?? {
          banner: 0,
          interstitial: 0,
          rewarded: 0,
        };
        const estimatedAdEarnings =
          ads.banner * 0.08 + ads.interstitial * 0.25 + ads.rewarded * 0.4;

        // 3️⃣ Scale ad earnings linearly based on totalScore / MAX_SCORE
        const scaledAdEarnings =
          estimatedAdEarnings * Math.min(totalScore / MAX_SCORE, 1);

        // 4️⃣ Cap at AD_EARNING_FRACTION of totalScore
        const cappedAdEarnings = Math.min(
          scaledAdEarnings,
          totalScore * AD_EARNING_FRACTION
        );

        // 5️⃣ Total points = totalScore + cappedAdEarnings, convert to coins
        const totalPoints = totalScore + cappedAdEarnings;
        const coinsEarned = Math.floor(totalPoints / POINTS_TO_COINS);

        // 6️⃣ Update user coins
        user.coin_earned += coinsEarned;

        // 7️⃣ Reset ads watched today
        user.adsWatchedToday = { banner: 0, interstitial: 0, rewarded: 0 };

        await user.save();
      }

      console.log("✅ Daily reward calculation completed");
    } catch (err) {
      console.error("❌ Error in daily reward cron:", err);
    }
  });
};
