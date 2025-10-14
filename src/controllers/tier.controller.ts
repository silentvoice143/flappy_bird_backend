import { Request, Response } from "express";
import { Tier } from "../models/tier.model";

// ✅ Create a new tier
export const createTier = async (req: Request, res: Response) => {
  const { category, level, min_exp, max_exp, tier_multiplier, overall_order } =
    req.body;

  // Validate category & level presence
  if (!category || !level) {
    return res.status(400).json({ message: "Category and level are required" });
  }

  const title = `${category} ${level}`;

  // Check if same title already exists
  const existing = await Tier.findOne({ title });
  if (existing) {
    return res.status(409).json({ message: "Tier already exists" });
  }

  const newTier = new Tier({
    category,
    level,
    title,
    min_exp,
    max_exp,
    tier_multiplier,
    overall_order,
  });

  await newTier.save();

  res.status(201).json({
    message: "Tier created successfully",
    tier: newTier,
  });
};

// ✅ Get all tiers (sorted by overall order)
export const getTiers = async (req: Request, res: Response) => {
  const tiers = await Tier.find().sort({ overall_order: 1 }); // ascending order
  res.status(200).json({ message: "Tiers fetched successfully", tiers });
};

// ✅ Edit / update a tier
export const editTier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  // If category or level changes, update title too
  if (updates.category && updates.level) {
    updates.title = `${updates.category} ${updates.level}`;
  }

  const updatedTier = await Tier.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedTier) {
    return res.status(404).json({ message: "Tier not found" });
  }

  res
    .status(200)
    .json({ message: "Tier updated successfully", tier: updatedTier });
};

// ✅ Delete a tier
export const deleteTier = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedTier = await Tier.findByIdAndDelete(id);
  if (!deletedTier) {
    return res.status(404).json({ message: "Tier not found" });
  }

  res
    .status(200)
    .json({ message: "Tier deleted successfully", tier: deletedTier });
};
