import { StatusCodes } from "http-status-codes";
import MentorshipRequest from "../models/MentorshipRequest.js";
import MentorProfile from "../models/MentorProfile.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotification } from "../services/notificationService.js";
import { ensureConversationForRequest } from "../services/conversationService.js";

export const createRequest = asyncHandler(async (req, res) => {
  const { mentorId, message, goals, preferredTime } = req.body;
  const existing = await MentorshipRequest.findOne({
    mentorId,
    menteeId: req.user._id,
    status: "pending",
  });

  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, "A pending request already exists");
  }

  const request = await MentorshipRequest.create({
    mentorId,
    menteeId: req.user._id,
    message,
    goals,
    preferredTime,
  });

  await createNotification({
    userId: mentorId,
    title: "New mentorship request",
    message: "A mentee has sent you a mentorship request.",
    type: "request",
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Request sent",
    data: request,
  });
});

export const getRequests = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "mentor" ? { mentorId: req.user._id } : { menteeId: req.user._id };

  const requests = await MentorshipRequest.find(query)
    .populate("mentorId", "name email avatar")
    .populate("menteeId", "name email avatar")
    .sort({ createdAt: -1 });

  sendResponse(res, { data: requests });
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  const request = await MentorshipRequest.findById(req.params.id);
  if (!request) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Request not found");
  }

  const isMentorOwner = request.mentorId.toString() === req.user._id.toString();
  const isMenteeOwner = request.menteeId.toString() === req.user._id.toString();

  if (!isMentorOwner && !isMenteeOwner) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You cannot update this request");
  }

  if (isMenteeOwner && req.body.status !== "rejected") {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "Mentees can only cancel their request",
    );
  }

  request.status = req.body.status;
  await request.save();

  if (req.body.status === "accepted" && isMentorOwner) {
    await MentorProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $inc: { totalMenteesGuided: 1 } },
    );

    await ensureConversationForRequest(request);
  }

  await createNotification({
    userId: request.menteeId,
    title: "Mentorship request updated",
    message: `Your mentorship request was ${req.body.status}.`,
    type: "request",
  });

  sendResponse(res, { message: "Request updated", data: request });
});
