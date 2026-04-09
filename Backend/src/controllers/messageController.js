import { StatusCodes } from "http-status-codes";
import Message from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { createNotification } from "../services/notificationService.js";

export const getConversations = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
  })
    .populate("senderId", "name avatar role")
    .populate("receiverId", "name avatar role")
    .sort({ updatedAt: -1 });

  const latestByUser = new Map();
  messages.forEach((message) => {
    const otherUser =
      message.senderId._id.toString() === req.user._id.toString()
        ? message.receiverId
        : message.senderId;
    if (!latestByUser.has(otherUser._id.toString())) {
      latestByUser.set(otherUser._id.toString(), {
        user: otherUser,
        latestMessage: message,
      });
    }
  });

  sendResponse(res, { data: Array.from(latestByUser.values()) });
});

export const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id, receiverId: userId },
      { senderId: userId, receiverId: req.user._id },
    ],
  }).sort({ createdAt: 1 });

  sendResponse(res, { data: messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const message = await Message.create({
    senderId: req.user._id,
    receiverId: req.body.receiverId,
    text: req.body.text,
  });

  await createNotification({
    userId: req.body.receiverId,
    title: "New message",
    message: "You have received a new chat message.",
    type: "message",
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Message sent",
    data: message,
  });
});
