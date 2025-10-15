import express from "express";
import { catchAsync } from "../utils/catchAsync";
import {
  createUserItem,
  getUserItems,
  getUserItemById,
  updateUserItem,
  deleteUserItem,
} from "../controllers/userItem.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UserItems
 *   description: User inventory management (purchase, equip, etc.)
 */

/**
 * @swagger
 * /user-items:
 *   post:
 *     summary: Purchase a new store item for a user
 *     tags: [UserItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - storeItemId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64f5a9f0c5a7b3d1e2a1b2c3
 *               storeItemId:
 *                 type: string
 *                 example: 64f5aa10c5a7b3d1e2a1b2c4
 *     responses:
 *       201:
 *         description: Item purchased successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Store item not found
 *       409:
 *         description: User already owns this item
 */
router.post("/", catchAsync(createUserItem));

/**
 * @swagger
 * /user-items:
 *   get:
 *     summary: Get all items for a user
 *     tags: [UserItems]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of user items
 *       400:
 *         description: Missing userId query
 */
router.get("/", catchAsync(getUserItems));

/**
 * @swagger
 * /user-items/{id}:
 *   get:
 *     summary: Get a single user item by ID
 *     tags: [UserItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the user item
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User item fetched successfully
 *       404:
 *         description: User item not found
 */
router.get("/:id", catchAsync(getUserItemById));

/**
 * @swagger
 * /user-items/{id}:
 *   put:
 *     summary: Update a user item (equip/unequip, etc.)
 *     tags: [UserItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the user item
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isEquipped:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User item updated successfully
 *       404:
 *         description: User item not found
 */
router.put("/:id", catchAsync(updateUserItem));

/**
 * @swagger
 * /user-items/{id}:
 *   delete:
 *     summary: Delete a user item
 *     tags: [UserItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the user item
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User item deleted successfully
 *       404:
 *         description: User item not found
 */
router.delete("/:id", catchAsync(deleteUserItem));

export default router;
