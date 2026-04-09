import User from "../models/User.js";
import Category from "../models/Category.js";
import MentorProfile from "../models/MentorProfile.js";
import Session from "../models/Session.js";
import Review from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/ApiResponse.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [users, mentors, mentees, sessions, reviews, categories, pendingApprovals] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "mentor" }),
      User.countDocuments({ role: "mentee" }),
      Session.countDocuments(),
      Review.countDocuments(),
      Category.countDocuments(),
      MentorProfile.countDocuments({ isApproved: false }),
    ]);

  sendResponse(res, {
    data: {
      stats: {
        users,
        mentors,
        mentees,
        sessions,
        reviews,
        categories,
        pendingApprovals,
      },
    },
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  sendResponse(res, { data: users });
});

export const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBlocked = !user.isBlocked;
  await user.save();
  const safeUser = await User.findById(req.params.id).select("-password");
  sendResponse(res, { message: "User status updated", data: safeUser });
});

export const getPendingMentors = asyncHandler(async (req, res) => {
  const mentors = await MentorProfile.find({ isApproved: false })
    .populate("userId", "name email avatar")
    .populate("category");
  sendResponse(res, { data: mentors });
});

export const approveMentor = asyncHandler(async (req, res) => {
  const mentor = await MentorProfile.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true },
  );
  sendResponse(res, { message: "Mentor approved", data: mentor });
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  sendResponse(res, { data: categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  sendResponse(res, { statusCode: 201, message: "Category created", data: category });
});
