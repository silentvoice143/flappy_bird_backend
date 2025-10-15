import { Request, Response } from "express";
import { Bird } from "../models/bird.model";

/**
 * Create a new Bird
 * Accepts form-data: { name, type, lvl, multiplier, points (optional), image (file) }
 */
export const createBird = async (req: Request, res: Response) => {
  const { name, type, lvl, multiplier, points } = req.body;
  const imageUrl = req.file ? `/uploads/birds/${req.file.filename}` : null;

  if (!name || !type || !lvl || !multiplier) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const bird = new Bird({
    name,
    type,
    lvl,
    multiplier,
    points,
    imageUrl,
  });

  await bird.save();

  res.status(201).json({
    success: true,
    message: "Bird created successfully!",
    data: bird,
  });
};

/**
 * Get all birds
 */
export const getAllBirds = async (req: Request, res: Response) => {
  const birds = await Bird.find().sort({ createdAt: -1 });
  res.json({ success: true, data: birds });
};

/**
 * Get a single bird by ID
 */
export const getBirdById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const bird = await Bird.findById(id);

  if (!bird) return res.status(404).json({ message: "Bird not found." });

  res.json({ success: true, data: bird });
};

/**
 * Update a bird
 * Accepts form-data: { name?, type?, lvl?, multiplier?, points?, image? }
 */
export const updateBird = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: any = { ...req.body };

  if (req.file) {
    updateData.imageUrl = `/uploads/birds/${req.file.filename}`;
  }

  const updatedBird = await Bird.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedBird) return res.status(404).json({ message: "Bird not found." });

  res.json({
    success: true,
    message: "Bird updated successfully.",
    data: updatedBird,
  });
};

/**
 * Delete a bird
 */
export const deleteBird = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedBird = await Bird.findByIdAndDelete(id);

  if (!deletedBird) return res.status(404).json({ message: "Bird not found." });

  res.json({
    success: true,
    message: "Bird deleted successfully.",
    data: deletedBird,
  });
};
