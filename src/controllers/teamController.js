import nodemailer, { createTestAccount } from "nodemailer";
import crypto from "crypto";
import Team from "../models/Team.js";
import User from "../models/User.js";

export const cleanupExpiredInvitations = async () => {
  try {
    const teams = await Team.find();
    let totalRemoved = 0; // Track the total number of removed invitations

    for (const team of teams) {
      const initialCount = team.invitations.length;
      team.invitations = team.invitations.filter(
        (invitation) => invitation.expiresAt > Date.now()
      );
      const removedCount = initialCount - team.invitations.length;
      totalRemoved += removedCount;

      if (removedCount > 0) {
        console.log(
          `Removed ${removedCount} expired invitations from team: ${team.name}`
        );
      }

      await team.save();
    }

    if (totalRemoved === 0) {
      console.log("No expired invitations found.");
    } else {
      console.log("Expired invitations cleaned up successfully.");
    }
  } catch (error) {
    console.error("Error cleaning up expired invitations:", error);
  }
};

export const createTeam = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;

  try {
    const team = new Team({
      name,
      description,
      members: [{ user: userId, role: "admin" }],
    });

    await team.save();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.teams.push({ team: team._id, role: "admin" });
    await user.save();

    return res.status(201).json({ message: "Team created successfully", team });
  } catch (error) {
    console.error("Error creating team:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const inviteUser = async (req, res) => {
  const { teamId } = req.params;
  const { email, role } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const invitationToken = crypto.randomBytes(32).toString("hex");
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const invitationUrl = `${process.env.FRONTEND_URL}/accept-invitation/${invitationToken}`;
    const mailOptions = {
      to: email,
      from: "no-reply@team-knowledge-hub.com",
      subject: "Team Invitation",
      text: `You have been invited to join the team "${team.name}" as a ${role}.\n\n
      Please click the following link to accept the invitation:\n\n
      ${invitationUrl}\n\n
      If you did not request this, please ignore this email.\n`,
    };

    const info = await transporter.sendMail(mailOptions);

    team.invitations.push({
      email,
      token: invitationToken,
      role,
      expiresAt: Date.now() + 3600000, // 1 hour expiration
    });
    await team.save();

    return res.status(200).json({
      message: "Invitation sent successfully",
      previewUrl: nodemailer.getTestMessageUrl(info), // Include the preview URL in the response
    });
  } catch (error) {
    console.error("Error inviting user:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const acceptInvitation = async (req, res) => {
  const { token } = req.params;
  const userId = req.user._id;

  try {
    const team = await Team.findOne({ "invitations.token": token });

    if (!team) {
      return res
        .status(404)
        .json({ message: "Invalid or expired invitation token" });
    }

    // Check if the user is already a member of the team
    const isAlreadyMember = team.members.some(
      (member) => member.user.toString() === userId.toString()
    );
    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this team" });
    }

    const invitation = team.invitations.find((inv) => inv.token === token);
    if (!invitation || invitation.expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ message: "Invalid or expired invitation token" });
    }

    team.members.push({ user: userId, role: invitation.role });
    team.invitations = team.invitations.filter((inv) => inv.token !== token);
    await team.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.teams.push({ team: team._id, role: invitation.role });
    await user.save();

    return res
      .status(200)
      .json({ message: "Invitation accepted successfully", team });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
