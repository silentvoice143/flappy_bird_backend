import { Request, Response } from "express";
import { Game } from "../models/game.model";
import { User } from "../models/user.model";

import { IUserStat, UserStat } from "../models/user-stat.model";
import { Season } from "../models/season.model";
import { ITier, Tier } from "../models/tier.model";

export const gameStart = async (req: Request, res: Response) => {
  const currentSeason = await Season.findOne({ isActive: true });
  if (!currentSeason)
    return res.status(402).json({ message: "No current season is active" });
  const game = await Game.create({
    userId: req.user?.id,
    startTime: new Date(),
    status: "in-progress",
    season: currentSeason._id,
  });
  return res.status(201).json({ message: "New game session created", game });
};

export const saveGameResult = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      score,
      duration,
      adsViewed = 0,
      seasonId,
      gameId,
    } = req.body;

    if (!userId || score == null || duration == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Find user and populate currentTier
    const user = await User.findById(userId).populate<{ currentTier?: ITier }>(
      "currentTier"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Find season
    const season = seasonId
      ? await Season.findById(seasonId)
      : await Season.findOne({ isActive: true });
    if (!season) return res.status(400).json({ message: "Season not found" });

    const now = new Date();
    const startedAt = new Date(now.getTime() - duration * 1000);

    // 3️⃣ Save the game
    const coinsEarned = Math.floor(score / 10);

    let game = await Game.findById({ _id: gameId });
    if (!game) {
      game = new Game({
        user: user._id,
        score,
        duration,
        startedAt,
        endedAt: now,
        coinsEarned,
        adsViewed,
      });
    }

    game.score = score;
    game.duration = duration;
    game.startedAt = startedAt;
    game.endedAt = now;
    game.adsViewed = adsViewed;

    await game.save();

    // 4️⃣ Update or create UserStat
    let userStat = await UserStat.findOne({
      user: user._id,
      season: season._id,
    }).populate<{ highest_tier_reached?: ITier }>("highest_tier_reached");

    let scoreTillNow = score;

    if (userStat) {
      userStat.total_game_played += 1;
      userStat.total_ads_watched += adsViewed;
      userStat.total_coin_earned += coinsEarned;

      if (score > userStat.best_score) userStat.best_score = score;
      scoreTillNow = userStat.best_score;

      await userStat.save();
    } else {
      userStat = (await UserStat.create({
        user: user._id,
        season: season._id,
        total_game_played: 1,
        total_ads_watched: adsViewed,
        total_coin_earned: coinsEarned,
        best_score: score,
      })) as any;
      await userStat!.populate<{ highest_tier_reached?: ITier }>(
        "highest_tier_reached"
      );
    }

    // 5️⃣ Determine the tier based on cumulative score
    const newTier = await Tier.findOne({
      min_score: { $lte: scoreTillNow },
      max_score: { $gte: scoreTillNow },
    }).sort({ min_score: -1 });

    if (newTier) {
      // Update user's currentTier if higher
      if (!user.currentTier || newTier.min_score > user.currentTier.min_score) {
        user.currentTier = newTier._id as any;
        await user.save();
      }

      // Update highest_tier_reached in UserStat if higher
      if (
        !userStat!.highest_tier_reached ||
        newTier.min_score > userStat!.highest_tier_reached.min_score
      ) {
        userStat!.highest_tier_reached = newTier._id as any;
        await userStat!.save();
      }
    }

    res.status(201).json({
      message: "Game saved, stats updated, and tier assigned",
      game,
      userStat,
      currentTier: newTier || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Get leaderboard (top 10 scores)
export const getLeaderboard = async (req: Request, res: Response) => {
  const topGames = await Game.aggregate([
    {
      $group: {
        _id: "$user",
        maxScore: { $max: "$score" },
      },
    },
    { $sort: { maxScore: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$user._id",
        name: "$user.name",
        maxScore: 1,
      },
    },
  ]);

  res.json({ leaderboard: topGames });
};

// 📌 Get all games of a user
export const getUserGames = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const games = await Game.find({ user: userId }).sort({ endedAt: -1 });
  res.json({ games });
};
