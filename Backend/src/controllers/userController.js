import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import MentorProfile from "../models/MentorProfile.js";
import MenteeProfile from "../models/MenteeProfile.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  const profile =
    req.user.role === "mentor"
      ? await MentorProfile.findOne({ userId: req.user._id }).populate("category")
      : req.user.role === "mentee"
        ? await MenteeProfile.findOne({ userId: req.user._id }).populate(
            "favorites",
            "name avatar",
          )
        : null;

  sendResponse(res, { data: { user, profile } });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar, ...profileData } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...(name && { name }), ...(phone !== undefined && { phone }), ...(avatar && { avatar }) },
    { new: true },
  ).select("-password");

  let profile = null;

  if (req.user.role === "mentor") {
    profile = await MentorProfile.findOneAndUpdate(
      { userId: req.user._id },
      profileData,
      { new: true, upsert: true },
    ).populate("category");
  }

  if (req.user.role === "mentee") {
    profile = await MenteeProfile.findOneAndUpdate(
      { userId: req.user._id },
      profileData,
      { new: true, upsert: true },
    );
  }

  sendResponse(res, {
    message: "Profile updated",
    data: { user, profile },
  });
});

export const toggleFavoriteMentor = asyncHandler(async (req, res) => {
  if (req.user.role !== "mentee") {
    throw new ApiError(StatusCodes.FORBIDDEN, "Only mentees can save mentors");
  }

  const profile = await MenteeProfile.findOne({ userId: req.user._id });
  const mentorId = req.params.mentorId;
  const exists = profile.favorites.some((id) => id.toString() === mentorId);

  profile.favorites = exists
    ? profile.favorites.filter((id) => id.toString() !== mentorId)
    : [...profile.favorites, mentorId];

  await profile.save();

  sendResponse(res, {
    message: exists ? "Removed from favorites" : "Added to favorites",
    data: profile,
  });
});
