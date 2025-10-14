import express from "express";
import {
  createSeason,
  getSeasons,
  getActiveSeason,
  updateSeason,
  deleteSeason,
  refreshSeasonStatuses,
} from "../controllers/season.controller";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Seasons
 *   description: Season management
 */

/**
 * @swagger
 * /seasons:
 *   post:
 *     summary: Create a new season
 *     tags: [Seasons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: Season 1
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-15T00:00:00.000Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-31T23:59:59.000Z
 *               rewards:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Reward ObjectId
 *     responses:
 *       201:
 *         description: Season created successfully
 *       409:
 *         description: Season already exists
 *       500:
 *         description: Internal server error
 */
router.post("/", catchAsync(createSeason));

/**
 * @swagger
 * /seasons:
 *   get:
 *     summary: Get all seasons
 *     tags: [Seasons]
 *     responses:
 *       200:
 *         description: All seasons fetched successfully
 *       500:
 *         description: Failed to fetch seasons
 */
router.get("/", catchAsync(getSeasons));

/**
 * @swagger
 * /seasons/active:
 *   get:
 *     summary: Get currently active season
 *     tags: [Seasons]
 *     responses:
 *       200:
 *         description: Active season found
 *       404:
 *         description: No active season
 *       500:
 *         description: Failed to fetch active season
 */
router.get("/active", catchAsync(getActiveSeason));

/**
 * @swagger
 * /seasons/{id}:
 *   put:
 *     summary: Update a season by ID
 *     tags: [Seasons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the season
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
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               rewards:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Season updated successfully
 *       404:
 *         description: Season not found
 *       500:
 *         description: Failed to update season
 */
router.put("/:id", catchAsync(updateSeason));

/**
 * @swagger
 * /seasons/{id}:
 *   delete:
 *     summary: Delete a season by ID
 *     tags: [Seasons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the season
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Season deleted successfully
 *       404:
 *         description: Season not found
 *       500:
 *         description: Failed to delete season
 */
router.delete("/:id", catchAsync(deleteSeason));

/**
 * @swagger
 * /seasons/status/refresh:
 *   post:
 *     summary: Manually refresh season statuses
 *     tags: [Seasons]
 *     responses:
 *       200:
 *         description: Season statuses updated successfully
 *       500:
 *         description: Failed to update season statuses
 */
router.post("/status/refresh", catchAsync(refreshSeasonStatuses));

export default router;
