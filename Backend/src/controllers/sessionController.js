import { StatusCodes } from "http-status-codes";
import Session from "../models/Session.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { createNotification } from "../services/notificationService.js";
import { ApiError } from "../utils/ApiError.js";

export const createSession = asyncHandler(async (req, res) => {
  const createdSession = await Session.create({
    ...req.body,
    menteeId: req.user.role === "mentee" ? req.user._id : req.body.menteeId,
    mentorId: req.user.role === "mentor" ? req.user._id : req.body.mentorId,
  });

  const notifyUserId =
    req.user.role === "mentor" ? createdSession.menteeId : createdSession.mentorId;
  await createNotification({
    userId: notifyUserId,
    title: "Session scheduled",
    message: `A ${createdSession.topic} session has been booked.`,
    type: "session",
  });

  const session = await Session.findById(createdSession._id)
    .populate("mentorId", "name avatar")
    .populate("menteeId", "name avatar");

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Session created",
    data: session,
  });
});

export const getSessions = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "mentor"
      ? { mentorId: req.user._id }
      : req.user.role === "mentee"
        ? { menteeId: req.user._id }
        : {};

  const sessions = await Session.find(query)
    .populate("mentorId", "name avatar")
    .populate("menteeId", "name avatar")
    .sort({ createdAt: -1 });

  sendResponse(res, { data: sessions });
});

export const updateSession = asyncHandler(async (req, res) => {
  const existingSession = await Session.findById(req.params.id);
  if (!existingSession) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Session not found");
  }

  const isMentorOwner = existingSession.mentorId.toString() === req.user._id.toString();
  const isMenteeOwner = existingSession.menteeId.toString() === req.user._id.toString();

  if (!isMentorOwner && !isMenteeOwner) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You cannot update this session");
  }

  const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .populate("mentorId", "name avatar")
    .populate("menteeId", "name avatar");

  if (req.body.status && req.body.status !== existingSession.status) {
    const notifyUserId = isMentorOwner ? session.menteeId._id : session.mentorId._id;
    await createNotification({
      userId: notifyUserId,
      title: "Session updated",
      message: `Your session "${session.topic}" is now ${req.body.status}.`,
      type: "session",
    });
  }

  sendResponse(res, { message: "Session updated", data: session });
});
