import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createTeam, inviteUser } from "../controllers/teamController.js";
import { acceptInvitation } from "../controllers/teamController.js"; 

const router = express.Router();

router.post("/", authMiddleware, createTeam);
router.post("/invite/:teamId", authMiddleware, inviteUser);
router.post("/accept-invitation/:token", authMiddleware, acceptInvitation);

export default router;
