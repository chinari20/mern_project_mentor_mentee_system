import { StatusCodes } from "http-status-codes";
import Review from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { refreshMentorRating } from "../services/mentorService.js";

export const createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({
    ...req.body,
    menteeId: req.user._id,
  });

  await refreshMentorRating(req.body.mentorId);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Review submitted",
    data: review,
  });
});

export const getReviews = asyncHandler(async (req, res) => {
  const query = {};

  if (req.query.mentorId) {
    query.mentorId = req.query.mentorId;
  }

  if (req.query.menteeId) {
    query.menteeId = req.query.menteeId === "me" && req.user ? req.user._id : req.query.menteeId;
  }

  if (req.query.sessionId) {
    query.sessionId = req.query.sessionId;
  }

  const reviews = await Review.find(query)
    .populate("menteeId", "name avatar")
    .populate("sessionId");

  sendResponse(res, { data: reviews });
});
