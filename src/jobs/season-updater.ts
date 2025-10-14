import cron from "node-cron";
import { Season, ISeason } from "../models/season.model";
import { User } from "../models/user.model";
import { UserStat } from "../models/user-stat.model";
import { Tier } from "../models/tier.model";

// Configurable batch size
const BATCH_SIZE = 200;

// Runs every day at 00:00 (midnight)
export const seasonCronJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("🌙 Running nightly season job:", new Date());

    try {
      // 1️⃣ Update all season statuses
      await Season.updateSeasonStatuses();

      // 2️⃣ Find active season (typed with generics)
      let activeSeason = await Season.findOne<ISeason>({
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
        status: "active",
      });

      // 3️⃣ If no active season, create default one
      if (!activeSeason) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3); // 3-month default season

        activeSeason = (await Season.create({
          title: `Season ${Date.now()}`,
          startDate,
          endDate,
          rewards: [],
        })) as ISeason;

        console.log(
          "✅ Default new season created:",
          (activeSeason._id as any).toString()
        );
      }

      // 4️⃣ Get default starting tier (typed)
      const defaultTier = await Tier.findOne({
        category: "Rookie",
        level: 1,
        overall_order: 1,
      });

      if (!defaultTier) throw new Error("No default tier found for new season");

      // 5️⃣ Use cursor to stream users
      const cursor = User.find({}).select("_id").cursor();
      let batch: any = [];
      let batchNumber = 1;

      for await (const user of cursor) {
        batch.push(user);

        if (batch.length === BATCH_SIZE) {
          await processUserBatch(
            batch,
            (activeSeason._id as any).toString(), // cast ObjectId to string
            defaultTier._id.toString(), // cast ObjectId to string
            batchNumber
          );
          batch = [];
          batchNumber++;
        }
      }

      // Process remaining users
      if (batch.length > 0) {
        await processUserBatch(
          batch,
          (activeSeason._id as any).toString(),
          defaultTier._id.toString(),
          batchNumber
        );
      }

      console.log("🌙 Nightly season job completed successfully");
    } catch (err) {
      console.error("❌ Error running season cron job:", err);
    }
  });
};

// Helper function to process each batch
const processUserBatch = async (
  batch: any,
  seasonId: string,
  defaultTierId: string,
  batchNumber: number
) => {
  const userIds = batch.map((u: any) => u._id);

  // 1️⃣ Find existing UserStats for this season in batch
  const existingStats = await UserStat.find({
    season: seasonId,
    user: { $in: userIds },
  }).select("user");

  const existingUserIds = new Set(existingStats.map((s) => s.user.toString()));

  // 2️⃣ Prepare new UserStats for users without one
  const newUserStats = batch
    .filter((u: any) => !existingUserIds.has(u._id.toString()))
    .map((u: any) => ({
      user: u._id,
      season: seasonId,
      highest_tier_reached: defaultTierId,
    }));

  if (newUserStats.length > 0) {
    await UserStat.insertMany(newUserStats);
    console.log(
      `✅ Created ${newUserStats.length} UserStats in batch ${batchNumber}`
    );
  }

  // 3️⃣ Reset tiers for users in this batch
  await User.updateMany(
    { _id: { $in: userIds } },
    { currentTier: defaultTierId }
  );

  console.log(`✅ Batch ${batchNumber} processed`);
};
