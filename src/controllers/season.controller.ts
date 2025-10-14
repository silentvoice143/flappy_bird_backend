import { Request, Response } from "express";
import { Season } from "../models/season.model";

// 🟢 Create a new season
export const createSeason = async (req: Request, res: Response) => {
  const { title, startDate, endDate, rewards } = req.body;

  // Check if season with same title exists
  const existing = await Season.findOne({ title });
  if (existing) {
    return res.status(409).json({ message: "Season already exists" });
  }

  const season = new Season({
    title,
    startDate,
    endDate,
    rewards: rewards || [],
  });

  await season.save();
  res.status(201).json({ message: "Season created successfully", season });
};

// 🟢 Get all seasons
export const getSeasons = async (req: Request, res: Response) => {
  const seasons = await Season.find().sort({ startDate: -1 });
  res
    .status(200)
    .json({ message: "All seasons fetched successfully", seasons });
};

// 🟢 Get currently active season
export const getActiveSeason = async (req: Request, res: Response) => {
  const now = new Date();
  const season = await Season.findOne({
    startDate: { $lte: now },
    endDate: { $gte: now },
  });

  if (!season) {
    return res.status(404).json({ message: "No active season found" });
  }

  res.status(200).json({ message: "Active season found", season });
};

// 🟢 Update a season by ID
export const updateSeason = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const season = await Season.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!season) {
    return res.status(404).json({ message: "Season not found" });
  }

  res.status(200).json({ message: "Season updated successfully", season });
};

// 🟢 Delete a season by ID
export const deleteSeason = async (req: Request, res: Response) => {
  const { id } = req.params;

  const season = await Season.findByIdAndDelete(id);

  if (!season) {
    return res.status(404).json({ message: "Season not found" });
  }

  res.status(200).json({ message: "Season deleted successfully", season });
};

// 🟢 Trigger manual status update
export const refreshSeasonStatuses = async (req: Request, res: Response) => {
  await Season.updateSeasonStatuses();
  res.status(200).json({ message: "Season statuses updated successfully" });
};
