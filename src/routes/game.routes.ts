import express from "express";
import { catchAsync } from "../utils/catchAsync";
import {
  saveGameResult,
  getLeaderboard,
  getUserGames,
  gameStart,
} from "../controllers/game.controller";

const router = express.Router();

/**
 * @swagger
 * /game/start:
 *   post:
 *     summary: Start a new game session
 *     description: Creates a new game session for the currently authenticated user under the active season.
 *     tags:
 *       - Game
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Successfully created a new game session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New game session created
 *                 game:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6710b6a5f8d91a2c7fa78c21
 *                     userId:
 *                       type: string
 *                       example: 6709e3b79b13dfc10a937b82
 *                     season:
 *                       type: string
 *                       example: 670f2ab81e0dc3c09a9eaa41
 *                     status:
 *                       type: string
 *                       enum: [in-progress, end]
 *                       example: in-progress
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-17T06:23:45.000Z
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-17T06:23:45.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-17T06:23:45.000Z
 *       402:
 *         description: No active season found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No current season is active
 *       401:
 *         description: Unauthorized - user not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
router.get("/", catchAsync(gameStart));

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Flappy Bird game results and leaderboard
 */

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Save a game result
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - score
 *               - duration
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64f5a9f0c5a7b3d1e2a1b2c3
 *               score:
 *                 type: number
 *                 example: 120
 *               duration:
 *                 type: number
 *                 description: Duration of the game in seconds
 *                 example: 35
 *               adsViewed:
 *                 type: number
 *                 example: 1
 *               seasonId:
 *                 type: string
 *                 description: Optional season ID
 *                 example: 64f5b0a0c5a7b3d1e2a1b2d4
 *     responses:
 *       201:
 *         description: Game saved successfully with updated stats and tier
 *       400:
 *         description: Missing required fields or season not found
 *       404:
 *         description: User not found
 */
router.post("/", catchAsync(saveGameResult));

/**
 * @swagger
 * /games/leaderboard:
 *   get:
 *     summary: Get top 10 players (leaderboard)
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: Leaderboard fetched successfully
 */
router.get("/leaderboard", catchAsync(getLeaderboard));

/**
 * @swagger
 * /games/user/{userId}:
 *   get:
 *     summary: Get all games played by a user
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: MongoDB ObjectId of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of games played by the user
 *       404:
 *         description: User not found
 */
router.get("/user/:userId", catchAsync(getUserGames));

export default router;
