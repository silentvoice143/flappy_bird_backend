import { Season } from "../models/season.model";

export const ensureDefaultSeason = async () => {
  let season = await Season.findOne();

  if (!season) {
    const now = new Date();
    const defaultEnd = new Date();
    defaultEnd.setMonth(now.getMonth() + 3); // 3-month season

    season = new Season({
      title: "Season 1",
      startDate: now,
      endDate: defaultEnd,
      rewards: [],
    });

    await season.save();
    console.log("✅ Default season created:", season._id);
  } else {
    console.log("Default season already exists:", season._id);
  }

  return season;
};
