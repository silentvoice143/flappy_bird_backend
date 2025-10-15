import {
  createBird,
  getAllBirds,
  getBirdById,
  updateBird,
  deleteBird,
} from "../controllers/bird.controller";
import express from "express";
import { createMulterUpload } from "../utils/multer";
import { catchAsync } from "../utils/catchAsync";
import { handleMulterErrors } from "../utils/multerErrorHandler";

const router = express.Router();

// Multer instance for bird images
const upload = createMulterUpload("image", "uploads/birds", 5);

/**
 * @swagger
 * tags:
 *   name: Birds
 *   description: Bird management and uploads
 */

/**
 * @swagger
 * /birds:
 *   post:
 *     summary: Create a new bird
 *     description: Upload a bird image (JPG/PNG/WEBP) along with details.
 *     tags: [Birds]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - multiplier
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [rookie, pro, elite]
 *               lvl:
 *                 type: number
 *               multiplier:
 *                 type: number
 *               points:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Bird created successfully
 *       400:
 *         description: Invalid request or file
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  handleMulterErrors(upload.single("image")),
  catchAsync(createBird)
);

/**
 * @swagger
 * /birds:
 *   get:
 *     summary: Get all birds
 *     tags: [Birds]
 *     responses:
 *       200:
 *         description: List of birds
 *       500:
 *         description: Server error
 */
router.get("/", catchAsync(getAllBirds));

/**
 * @swagger
 * /birds/{id}:
 *   get:
 *     summary: Get a bird by ID
 *     tags: [Birds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the bird
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bird found
 *       404:
 *         description: Bird not found
 *       500:
 *         description: Server error
 */
router.get("/:id", catchAsync(getBirdById));

/**
 * @swagger
 * /birds/{id}:
 *   put:
 *     summary: Update a bird
 *     tags: [Birds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the bird
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [rookie, pro, elite]
 *               lvl:
 *                 type: number
 *               multiplier:
 *                 type: number
 *               points:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Bird updated successfully
 *       404:
 *         description: Bird not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  handleMulterErrors(upload.single("image")),
  catchAsync(updateBird)
);

/**
 * @swagger
 * /birds/{id}:
 *   delete:
 *     summary: Delete a bird
 *     tags: [Birds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the bird
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bird deleted successfully
 *       404:
 *         description: Bird not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", catchAsync(deleteBird));

export default router;
