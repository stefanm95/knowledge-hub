import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createTeam,
  inviteUser,
  acceptInvitation,
  getTeamMembers,
} from "../controllers/teamController.js";

const router = express.Router();

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
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
 *                 description: The name of the team
 *                 example: "Development Team"
 *               description:
 *                 type: string
 *                 description: A brief description of the team
 *                 example: "Team responsible for backend development"
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Team created successfully"
 *                 team:
 *                   $ref: "#/components/schemas/Team"
 */
router.post("/", authMiddleware, createTeam);

router.post("/invite/:teamId", authMiddleware, inviteUser);
router.post("/accept-invitation/:token", authMiddleware, acceptInvitation);

/**
 * @swagger
 * /teams/{id}/members:
 *   get:
 *     summary: Get members of a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the team
 *     responses:
 *       200:
 *         description: Team members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 members:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/User"
 *       404:
 *         description: Team not found
 */
router.get("/:id/members", authMiddleware, getTeamMembers);

export default router;
