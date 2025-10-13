import { createBird, getAllBirds } from "./../controllers/bird.controller";
import express from "express";
import { createMulterUpload } from "../utils/multer";
import { catchAsync } from "../utils/catchAsync";
import { handleMulterErrors } from "../utils/multerErrorHandler";

const router = express.Router();

// Create multer instance for bird images
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
 *     description: Upload a bird image (JPG/PNG/WEBP) along with details like name, type, and multiplier. The image will be stored in the backend and the URL saved in MongoDB.
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
 *                 example: "Blue Falcon"
 *                 description: Unique name of the bird.
 *               type:
 *                 type: string
 *                 enum: [rookie, pro, elite]
 *                 example: "pro"
 *               lvl:
 *                 type: number
 *                 example: 3
 *                 description: Level of the bird.
 *               multiplier:
 *                 type: number
 *                 example: 2
 *                 description: Score multiplier for this bird.
 *               points:
 *                 type: number
 *                 example: 50
 *                 description: Optional initial points.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Bird image (JPG, PNG, or WEBP; max 5MB)
 *     responses:
 *       201:
 *         description: Bird created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Bird created successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 671aa4d20f5b3e9c1e6f9a7b
 *                     name:
 *                       type: string
 *                       example: Blue Falcon
 *                     type:
 *                       type: string
 *                       example: pro
 *                     lvl:
 *                       type: number
 *                       example: 3
 *                     multiplier:
 *                       type: number
 *                       example: 2
 *                     imageUrl:
 *                       type: string
 *                       example: /uploads/birds/blue-falcon-1712345678901.png
 *                     points:
 *                       type: number
 *                       example: 50
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid file type or file too large.
 *       500:
 *         description: Internal server error.
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
 *     description: Retrieve a list of all birds stored in the database.
 *     tags: [Birds]
 *     responses:
 *       200:
 *         description: List of birds fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 671aa4d20f5b3e9c1e6f9a7b
 *                       name:
 *                         type: string
 *                         example: Blue Falcon
 *                       type:
 *                         type: string
 *                         example: pro
 *                       lvl:
 *                         type: number
 *                         example: 3
 *                       multiplier:
 *                         type: number
 *                         example: 2
 *                       imageUrl:
 *                         type: string
 *                         example: /uploads/birds/blue-falcon-1712345678901.png
 *                       points:
 *                         type: number
 *                         example: 50
 *       500:
 *         description: Server error while fetching birds.
 */
router.get("/", catchAsync(getAllBirds));

export default router;
