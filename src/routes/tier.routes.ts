import express from "express";
import {
  createTier,
  getTier,
  editTier,
  deleteTier,
} from "../controllers/tier.controller";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tiers
 *   description: Tier management
 */

/**
 * @swagger
 * /tiers:
 *   post:
 *     summary: Create a new tier
 *     tags: [Tiers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - min_exp_required
 *               - tier_multiplier
 *             properties:
 *               title:
 *                 type: string
 *                 example: Bronze
 *               min_exp_required:
 *                 type: number
 *                 example: 100
 *               tier_multiplier:
 *                 type: number
 *                 example: 1.2
 *     responses:
 *       200:
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
 *     summary: Get all tiers
 *     tags: [Tiers]
 *     responses:
 *       200:
 *         description: All tiers fetched successfully
 *       500:
 *         description: Failed to fetch tiers
 */
router.get("/", catchAsync(getTier));

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
 *               title:
 *                 type: string
 *                 example: Silver
 *               min_exp_required:
 *                 type: number
 *                 example: 300
 *               tier_multiplier:
 *                 type: number
 *                 example: 1.5
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
