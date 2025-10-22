import express from "express";
import {
  createTier,
  getTiers,
  editTier,
  deleteTier,
} from "../controllers/tier.controller";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tiers
 *   description: Tier management (Rookie, Pro, Elite, etc. with sub-levels)
 */

/**
 * @swagger
 * /tiers:
 *   post:
 *     summary: Create a new tier (like Rookie 1, Pro 2, etc.)
 *     tags: [Tiers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - level
 *               - min_score
 *               - max_score
 *               - tier_multiplier
 *               - overall_order
 *             properties:
 *               category:
 *                 type: string
 *                 example: Rookie
 *               level:
 *                 type: number
 *                 example: 2
 *               min_score:
 *                 type: number
 *                 example: 500
 *               max_score:
 *                 type: number
 *                 example: 999
 *               tier_multiplier:
 *                 type: number
 *                 example: 1.1
 *               overall_order:
 *                 type: number
 *                 example: 2
 *               color:
 *                 type: string
 *                 example: "#FFD700"
 *               badge_url:
 *                 type: string
 *                 example: "https://example.com/badge.png"
 *     responses:
 *       201:
 *         description: Tier successfully created
 *       409:
 *         description: Tier already exists
 *       500:
 *         description: Internal server error
 */
router.post("/", catchAsync(createTier));

/**
 * @swagger
 * /tiers:
 *   get:
 *     summary: Get all tiers (sorted by overall order)
 *     tags: [Tiers]
 *     responses:
 *       200:
 *         description: All tiers fetched successfully
 *       500:
 *         description: Failed to fetch tiers
 */
router.get("/", catchAsync(getTiers));

/**
 * @swagger
 * /tiers/{id}:
 *   put:
 *     summary: Edit a tier by ID
 *     tags: [Tiers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the tier
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: Pro
 *               level:
 *                 type: number
 *                 example: 3
 *               min_score:
 *                 type: number
 *                 example: 2000
 *               max_score:
 *                 type: number
 *                 example: 2499
 *               tier_multiplier:
 *                 type: number
 *                 example: 1.4
 *               overall_order:
 *                 type: number
 *                 example: 5
 *               color:
 *                 type: string
 *                 example: "#C0C0C0"
 *               badge_url:
 *                 type: string
 *                 example: "https://example.com/badge.png"
 *     responses:
 *       200:
 *         description: Tier updated successfully
 *       404:
 *         description: Tier not found
 *       500:
 *         description: Failed to update tier
 */
router.put("/:id", catchAsync(editTier));

/**
 * @swagger
 * /tiers/{id}:
 *   delete:
 *     summary: Delete a tier by ID
 *     tags: [Tiers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the tier
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tier deleted successfully
 *       404:
 *         description: Tier not found
 *       500:
 *         description: Failed to delete tier
 */
router.delete("/:id", catchAsync(deleteTier));

export default router;
