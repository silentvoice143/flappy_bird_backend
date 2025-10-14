import { Request, Response } from "express";
import { Tier } from "../models/tier.model";

export const createTier = async (req: Request, res: Response) => {
  const { title, min_exp_required, tier_multiplier } = req.body;
  const tier = await Tier.findOne({ title });
  if (tier) {
    return res.status(409).json({ message: "Tier already exist" });
  }
  const newTier = new Tier({
    title,
    min_exp_required,
    tier_multiplier,
  });
  newTier.save();

  res.status(200).json({ message: "Tier successfully created", newTier });
};

export const getTier = async (req: Request, res: Response) => {
  const tiers = await Tier.find().sort({ createdAt: -1 });
  res.status(200).json({ message: "All tier found", tiers });
};

export const editTier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedTier = await Tier.findByIdAndUpdate(id, updates, {
    new: true, // return the updated document
    runValidators: true, // validate updates against schema
  });

  if (!updatedTier) {
    return res.status(404).json({ message: "Tier not found" });
  }

  res
    .status(200)
    .json({ message: "Tier updated successfully", tier: updatedTier });
};

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
