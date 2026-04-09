import mongoose from "mongoose";

const menteeProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    education: { type: String, default: "" },
    interests: [{ type: String }],
    careerGoals: [{ type: String }],
    skillsToLearn: [{ type: String }],
    preferredDomains: [{ type: String }],
    bio: { type: String, default: "" },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export default mongoose.model("MenteeProfile", menteeProfileSchema);
