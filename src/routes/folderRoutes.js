import express from "express";
import {
  createFolder,
  getFolderWithDocuments,
} from "../controllers/folderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /folders:
 *   post:
 *     summary: Create a new folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the folder
 *                 example: "Project Documents"
 *               description:
 *                 type: string
 *                 description: A brief description of the folder
 *                 example: "Folder for storing project-related documents"
 *     responses:
 *       201:
 *         description: Folder created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Folder created successfully"
 *                 folder:
 *                   $ref: "#/components/schemas/Folder"
 */
router.post("/", authMiddleware, createFolder);

/**
 * @swagger
 * /folders/{id}:
 *   get:
 *     summary: Get a folder with its associated documents
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the folder
 *     responses:
 *       200:
 *         description: Folder retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 folder:
 *                   $ref: "#/components/schemas/Folder"
 *       404:
 *         description: Folder not found
 */
router.get("/:id", authMiddleware, getFolderWithDocuments);

export default router;
