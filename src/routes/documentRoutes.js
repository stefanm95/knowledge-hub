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
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.post("/:id/summary", authMiddleware, generateSummary);
router.patch("/documents/:id/folder", authMiddleware, updateDocumentFolder);

export default router;
