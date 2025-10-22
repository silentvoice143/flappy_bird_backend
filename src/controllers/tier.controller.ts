import { Request, Response } from "express";
import { Tier } from "../models/tier.model";

// ✅ Create a new tier
export const createTier = async (req: Request, res: Response) => {
  try {
    const {
      category,
      level,
      min_score,
      max_score,
      tier_multiplier,
      overall_order,
      color,
      badge_url,
    } = req.body;

    // Validate required fields
    if (
      !category ||
      !level ||
      min_score == null ||
      max_score == null ||
      overall_order == null
    ) {
      return res
        .status(400)
        .json({
          message:
            "Category, level, min_score, max_score, and overall_order are required",
        });
    }

    const title = `${category} ${level}`;

    // Check if same title already exists
    const existing = await Tier.findOne({ title });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Tier with this title already exists" });
    }

    const newTier = new Tier({
      category,
      level,
      title,
      min_score,
      max_score,
      tier_multiplier: tier_multiplier ?? 1,
      overall_order,
      color,
      badge_url,
    });

    await newTier.save();

    res.status(201).json({
      message: "Tier created successfully",
      tier: newTier,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all tiers (sorted by overall order)
export const getTiers = async (req: Request, res: Response) => {
  try {
    const tiers = await Tier.find().sort({ overall_order: 1 }); // ascending
    res.status(200).json({ message: "Tiers fetched successfully", tiers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Edit / update a tier
export const editTier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If category or level changes, update title
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete a tier
export const deleteTier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedTier = await Tier.findByIdAndDelete(id);
    if (!deletedTier) {
      return res.status(404).json({ message: "Tier not found" });
    }

    res
      .status(200)
      .json({ message: "Tier deleted successfully", tier: deletedTier });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
