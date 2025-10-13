import { Bird } from "../models/bird.model";
import { Request, Response } from "express";

/**
 * Create a new Bird
 * Accepts form-data: { name, type, lvl, multiplier, points (optional), image (file) }
 */
export const createBird = async (req: Request, res: Response) => {
  const { name, type, lvl, multiplier, points } = req.body;
  const imageUrl = req.file ? `/uploads/birds/${req.file.filename}` : null;

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
