import MentorProfile from "../models/MentorProfile.js";
import Review from "../models/Review.js";
import MentorshipRequest from "../models/MentorshipRequest.js";
import Session from "../models/Session.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/ApiResponse.js";

export const getMentors = asyncHandler(async (req, res) => {
  const { search, category, sortBy, minRating, maxFee } = req.query;

  const profiles = await MentorProfile.find({ isApproved: true })
    .populate("category")
    .populate({
      path: "userId",
      select: "name email avatar createdAt",
      match: { isBlocked: false },
    });

  let mentorList = profiles
    .filter((item) => item.userId)
    .map((item) => ({
      ...item.toObject(),
      user: item.userId,
    }));

  if (search) {
    const searchValue = search.toLowerCase();
    mentorList = mentorList.filter(
      (mentor) =>
        mentor.user.name.toLowerCase().includes(searchValue) ||
        mentor.expertise.some((skill) => skill.toLowerCase().includes(searchValue)),
    );
  }

  if (category) {
    mentorList = mentorList.filter(
      (mentor) =>
        mentor.category?.name?.toLowerCase() === category.toLowerCase() ||
        mentor.category?._id?.toString() === category,
    );
  }

  if (minRating) {
    mentorList = mentorList.filter(
      (mentor) => mentor.ratingAverage >= Number(minRating),
    );
  }

  if (maxFee) {
    mentorList = mentorList.filter((mentor) => mentor.fee <= Number(maxFee));
  }

  if (sortBy === "rating") mentorList.sort((a, b) => b.ratingAverage - a.ratingAverage);
  if (sortBy === "popular")
    mentorList.sort((a, b) => b.totalMenteesGuided - a.totalMenteesGuided);
  if (sortBy === "newest")
    mentorList.sort(
      (a, b) => new Date(b.user.createdAt).getTime() - new Date(a.user.createdAt).getTime(),
    );

  sendResponse(res, { data: mentorList });
});

export const getMentorById = asyncHandler(async (req, res) => {
  const mentor = await MentorProfile.findOne({ userId: req.params.id })
    .populate("category")
    .populate("userId", "name email avatar");
  const reviews = await Review.find({ mentorId: req.params.id })
    .populate("menteeId", "name avatar")
    .sort({ createdAt: -1 });

  sendResponse(res, { data: { mentor, reviews } });
});

export const getMentorDashboard = asyncHandler(async (req, res) => {
  const [profile, pendingRequests, acceptedRequests, upcomingSessions, reviews] =
    await Promise.all([
      MentorProfile.findOne({ userId: req.user._id }).populate("category"),
      MentorshipRequest.find({ mentorId: req.user._id, status: "pending" }).populate(
        "menteeId",
        "name email avatar",
      ),
      MentorshipRequest.find({ mentorId: req.user._id, status: "accepted" }).populate(
        "menteeId",
        "name email avatar",
      ),
      Session.find({ mentorId: req.user._id }).populate("menteeId", "name avatar"),
      Review.find({ mentorId: req.user._id }).populate("menteeId", "name avatar"),
    ]);

  sendResponse(res, {
    data: {
      profile,
      stats: {
        pendingRequests: pendingRequests.length,
        activeMentees: acceptedRequests.length,
        sessions: upcomingSessions.length,
        reviews: reviews.length,
      },
      pendingRequests,
      acceptedRequests,
      upcomingSessions,
      reviews,
    },
  });
});
