import { StatusCodes } from "http-status-codes";
import Conversation from "../models/Conversation.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/ApiResponse.js";
import {
  ensureConversationBetweenUsers,
  getAcceptedRequestBetweenUsers,
  syncAcceptedConversationsForUser,
} from "../services/conversationService.js";

const formatConversation = (conversation, currentUserId) => {
  const conversationObject = conversation.toObject();
  const otherUser =
    conversation.mentorId?._id?.toString() === currentUserId.toString()
      ? conversation.menteeId
      : conversation.mentorId;

  return {
    ...conversationObject,
    otherUser,
  };
};

const assertConversationAccess = (req, userId) => {
  if (req.user.role !== "admin" && req.user._id.toString() !== userId.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You cannot view these conversations");
  }
};

export const createConversation = asyncHandler(async (req, res) => {
  const senderId = req.body.senderId || req.user._id;
  const receiverId = req.body.receiverId;

  if (!receiverId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "receiverId is required");
  }

  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== senderId.toString() &&
    req.user._id.toString() !== receiverId.toString()
  ) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You cannot create this conversation");
  }

  const acceptedRequest = await getAcceptedRequestBetweenUsers(senderId, receiverId);
  if (!acceptedRequest) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "Only accepted mentor-mentee pairs can start a conversation",
    );
  }

  const conversation = await ensureConversationBetweenUsers(senderId, receiverId);
  const populatedConversation = await Conversation.findById(conversation._id)
    .populate("mentorId", "name avatar role email")
    .populate("menteeId", "name avatar role email");

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Conversation ready",
    data: formatConversation(populatedConversation, req.user._id),
  });
});

export const getConversationsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  assertConversationAccess(req, userId);

  await syncAcceptedConversationsForUser(userId);

  const conversations = await Conversation.find({ members: userId })
    .populate("mentorId", "name avatar role email")
    .populate("menteeId", "name avatar role email")
    .sort({ lastMessageAt: -1, updatedAt: -1 });

  sendResponse(res, {
    data: conversations.map((conversation) => formatConversation(conversation, userId)),
  });
});

export const findConversation = asyncHandler(async (req, res) => {
  const { firstUserId, secondUserId } = req.params;

  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== firstUserId.toString() &&
    req.user._id.toString() !== secondUserId.toString()
  ) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You cannot view this conversation");
  }

  let conversation = await Conversation.findOne({
    $or: [
      { mentorId: firstUserId, menteeId: secondUserId },
      { mentorId: secondUserId, menteeId: firstUserId },
    ],
  })
    .populate("mentorId", "name avatar role email")
    .populate("menteeId", "name avatar role email");

  if (!conversation) {
    const acceptedRequest = await getAcceptedRequestBetweenUsers(firstUserId, secondUserId);
    if (!acceptedRequest) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
    }

    const createdConversation = await ensureConversationBetweenUsers(firstUserId, secondUserId);
    conversation = await Conversation.findById(createdConversation._id)
      .populate("mentorId", "name avatar role email")
      .populate("menteeId", "name avatar role email");
  }

  sendResponse(res, { data: formatConversation(conversation, req.user._id) });
});
