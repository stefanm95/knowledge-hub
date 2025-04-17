import express from "express";
import {
  createDocument,
  uploadFile,
  generateSummary,
  updateDocumentFolder,
} from "../controllers/documentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../utils/multerConfig.js";

const router = express.Router();

router.post("/", authMiddleware, createDocument);

/**
 * @swagger
 * /documents/upload:
 *   post:
 *     summary: Upload a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *               folder:
 *                 type: string
 *                 description: The ID of the folder to associate the document with
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded and saved successfully"
 *                 document:
 *                   $ref: "#/components/schemas/Document"
 */
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

/**
 * @swagger
 * /documents/{id}/summary:
 *   post:
 *     summary: Generate a summary for a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the document
 *     responses:
 *       200:
 *         description: Summary generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Summary generated successfully"
 *                 summary:
 *                   type: string
 *                   example: "This is the summary of the document."
 *       404:
 *         description: Document not found
 */
router.post("/:id/summary", authMiddleware, generateSummary);

/**
 * @swagger
 * /documents/{id}/folder:
 *   patch:
 *     summary: Update the folder associated with a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               folder:
 *                 type: string
 *                 description: The ID of the folder to associate with the document
 *     responses:
 *       200:
 *         description: Folder updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Document folder updated successfully"
 *                 document:
 *                   $ref: "#/components/schemas/Document"
 *       404:
 *         description: Document not found
 */
router.patch("/:id/folder", authMiddleware, updateDocumentFolder);

export default router;
