import { StatusCodes } from "http-status-codes";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  sendResponse(res, { data: notifications });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true },
    { new: true },
  );
  if (!notification) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Notification not found");
  }
  sendResponse(res, { message: "Notification updated", data: notification });
});
