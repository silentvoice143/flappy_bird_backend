import express from "express";
import {
  getUserDetails,
  updateUserInfo,
  incrementAdsWatched,
} from "../controllers/user.controller";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user details
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details fetched
 */
router.get("/:userId", catchAsync(getUserDetails));

/**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     summary: Update user info
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               profilePic:
 *                 type: string
 *     responses:
 *       200:
 *         description: User info updated
 */
router.patch("/:userId", catchAsync(updateUserInfo));

/**
 * @swagger
 * /users/{userId}/ads:
 *   patch:
 *     summary: Increment ads watched count
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [banner, interstitial, rewarded]
 *               count:
 *                 type: number
 *                 default: 1
 *     responses:
 *       200:
 *         description: Ads count updated
 */
router.patch("/:userId/ads", catchAsync(incrementAdsWatched));

export default router;
