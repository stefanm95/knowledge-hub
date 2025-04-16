import express from "express";
import { createFolder } from '../controllers/folderController.js';
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createFolder);

export default router;
