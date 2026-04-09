import mongoose from "mongoose";
import Review from "../models/Review.js";
import MentorProfile from "../models/MentorProfile.js";

export const refreshMentorRating = async (mentorId) => {
  const id = new mongoose.Types.ObjectId(mentorId);
  const stats = await Review.aggregate([
    { $match: { mentorId: id } },
    {
      $group: {
        _id: "$mentorId",
        average: { $avg: "$rating" },
        total: { $sum: 1 },
      },
    },
  ]);

  const [result] = stats;

  await MentorProfile.findOneAndUpdate(
    { userId: mentorId },
    {
      ratingAverage: result?.average ? Number(result.average.toFixed(1)) : 0,
      totalReviews: result?.total || 0,
    },
  );
};
