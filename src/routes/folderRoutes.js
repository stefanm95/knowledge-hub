import express from "express";
import { createFolder, getFolderWithDocuments } from '../controllers/folderController.js';
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createFolder);
router.get("/:id", authMiddleware, getFolderWithDocuments);


export default router;
