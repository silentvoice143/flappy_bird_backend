import express from "express";
import {
  createStoreItem,
  getAllStoreItems,
  getStoreItemById,
  updateStoreItem,
  deleteStoreItem,
} from "../controllers/store.controller";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: StoreItems
 *   description: Store Item management (Birds, etc.)
 */

/**
 * @swagger
 * /store-items:
 *   post:
 *     summary: Create a new store item
 *     tags: [StoreItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - itemType
 *               - itemId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rookie Bird
 *               price:
 *                 type: number
 *                 example: 200
 *               itemType:
 *                 type: string
 *                 enum: [Bird]
 *                 example: Bird
 *               itemId:
 *                 type: string
 *                 example: 670ec83f33a8f0b7cf812a1d
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Store item created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/", catchAsync(createStoreItem));

/**
 * @swagger
 * /store-items:
 *   get:
 *     summary: Get all store items with optional filters
 *     tags: [StoreItems]
 *     parameters:
 *       - in: query
 *         name: itemType
 *         schema:
 *           type: string
 *         description: Filter by item type (e.g., Bird)
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by availability (true or false)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Filter items with price greater than or equal to this value
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Filter items with price less than or equal to this value
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Text search in item name
 *     responses:
 *       200:
 *         description: All store items fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", catchAsync(getAllStoreItems));

/**
 * @swagger
 * /store-items/{id}:
 *   get:
 *     summary: Get a store item by ID
 *     tags: [StoreItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the store item
 *     responses:
 *       200:
 *         description: Store item fetched successfully
 *       404:
 *         description: Store item not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", catchAsync(getStoreItemById));

/**
 * @swagger
 * /store-items/{id}:
 *   put:
 *     summary: Update a store item by ID
 *     tags: [StoreItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the store item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               itemType:
 *                 type: string
 *                 enum: [Bird]
 *               itemId:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Store item updated successfully
 *       404:
 *         description: Store item not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", catchAsync(updateStoreItem));

/**
 * @swagger
 * /store-items/{id}:
 *   delete:
 *     summary: Delete a store item by ID
 *     tags: [StoreItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the store item
 *     responses:
 *       200:
 *         description: Store item deleted successfully
 *       404:
 *         description: Store item not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", catchAsync(deleteStoreItem));

export default router;
