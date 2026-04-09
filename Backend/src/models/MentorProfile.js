import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    day: String,
    startTime: String,
    endTime: String,
    timezone: { type: String, default: "Asia/Calcutta" },
  },
  { _id: false },
);

const mentorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: { type: String, default: "" },
    expertise: [{ type: String }],
    experience: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    headline: { type: String, default: "" },
    availability: [availabilitySchema],
    portfolioLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    languages: [{ type: String }],
    fee: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalMenteesGuided: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("MentorProfile", mentorProfileSchema);
