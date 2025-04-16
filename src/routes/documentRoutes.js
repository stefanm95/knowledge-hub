import express from "express";
import { createDocument } from '../controllers/documentController.js';
import { uploadFile } from '../controllers/documentController.js';
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from '../utils/multerConfig.js';

const router = express.Router();

router.post("/", authMiddleware, createDocument);
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);


export default router;
