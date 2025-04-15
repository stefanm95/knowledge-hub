import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { createTeam, inviteUser } from "../controllers/teamController.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", (req, res) => registerUser(req, res, User));
router.post("/login", (req, res) => loginUser(req, res, User));

router.post("/forgot-password", async (req, res) =>
  forgotPassword(req, res, User)
);
router.post("/reset-password", async (req, res) =>
  resetPassword(req, res, User)
);

export default router;
