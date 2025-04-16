import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["admin", "member"], default: "member" },
      joinedAt: { type: Date, default: Date.now },
    },
  ],
  invitations: [
    {
      email: { type: String, required: true },
      token: { type: String, required: true },
      role: { type: String, enum: ["admin", "member"], default: "member" },
      expiresAt: { type: Date, default: () => Date.now() + 3600000}, // 1 hour expiration
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

teamSchema.pre("save", function (next) {
  this.invitations = this.invitations.filter(
    (invitation) => invitation.expiresAt > Date.now()
  );
  next();
})

export default mongoose.model("Team", teamSchema);
