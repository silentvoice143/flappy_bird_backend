import User from "../models/user.model";
import { IUser } from "../types/user"; // adjust path based on your structure

interface SeasonStatInput {
  seasonId: string;
  totalScore?: number;
  bestScore?: number;
  tier?: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  gamesPlayed?: number;
  startDate?: Date;
  endDate?: Date;
}

export const addSeasonStatToUser = async (
  userId: string,
  newStat: SeasonStatInput
): Promise<IUser | null> => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  const exists = user.seasonStats.some(
    (stat) => stat.seasonId === newStat.seasonId
  );
  if (exists) throw new Error("Season already exists for this user");

  user.seasonStats.push({
    seasonId: newStat.seasonId,
    totalScore: newStat.totalScore ?? 0,
    bestScore: newStat.bestScore ?? 0,
    tier: newStat.tier ?? "Bronze",
    gamesPlayed: newStat.gamesPlayed ?? 0,
    startDate: newStat.startDate,
    endDate: newStat.endDate,
  });

  await user.save();
  return user;
};
