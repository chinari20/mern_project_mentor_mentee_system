import { StatusCodes } from "http-status-codes";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { createNotification } from "../services/notificationService.js";
import { ApiError } from "../utils/ApiError.js";

export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
  }

  if (
    req.user.role !== "admin" &&
    !conversation.members.some((memberId) => memberId.toString() === req.user._id.toString())
  ) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You cannot view messages for this conversation");
  }

  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

  sendResponse(res, { data: messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, text } = req.body;
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
  }

  if (
    req.user.role !== "admin" &&
    !conversation.members.some((memberId) => memberId.toString() === req.user._id.toString())
  ) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You cannot send messages to this conversation");
  }

  const receiverId =
    conversation.mentorId.toString() === req.user._id.toString()
      ? conversation.menteeId
      : conversation.mentorId;

  const message = await Message.create({
    conversationId,
    senderId: req.user._id,
    receiverId,
    text,
  });

  conversation.lastMessage = text;
  conversation.lastMessageAt = message.createdAt;
  await conversation.save();

  await createNotification({
    userId: receiverId,
    title: "New message",
    message: "You have received a new chat message.",
    type: "message",
  });

  const populatedMessage = await Message.findById(message._id)
    .populate("senderId", "name avatar role")
    .populate("receiverId", "name avatar role");

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Message sent",
    data: populatedMessage,
  });
});
