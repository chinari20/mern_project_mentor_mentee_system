import { StatusCodes } from "http-status-codes";
import Goal from "../models/Goal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { createNotification } from "../services/notificationService.js";

export const createGoal = asyncHandler(async (req, res) => {
  const createdGoal = await Goal.create({
    ...req.body,
    menteeId: req.user.role === "mentee" ? req.user._id : req.body.menteeId,
  });

  const goal = await Goal.findById(createdGoal._id)
    .populate("menteeId", "name avatar")
    .populate("mentorId", "name avatar");

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Goal created",
    data: goal,
  });
});

export const getGoals = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "mentor" ? { mentorId: req.user._id } : { menteeId: req.user._id };

  const goals = await Goal.find(query)
    .populate("menteeId", "name avatar")
    .populate("mentorId", "name avatar");

  sendResponse(res, { data: goals });
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate("menteeId", "name avatar")
    .populate("mentorId", "name avatar");

  const notifyUserId = req.user.role === "mentor" ? goal.menteeId : goal.mentorId;
  await createNotification({
    userId: notifyUserId,
    title: "Goal updated",
    message: `Goal "${goal.title}" has been updated.`,
    type: "goal",
  });

  sendResponse(res, { message: "Goal updated", data: goal });
});
