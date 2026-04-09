import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import MentorProfile from "../models/MentorProfile.js";
import MenteeProfile from "../models/MenteeProfile.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/generateToken.js";

const buildAuthPayload = (user) => ({
  token: generateToken({ id: user._id, role: user.role }),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  },
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!["mentor", "mentee"].includes(role)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid registration role");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, "Email already registered");
  }

  const user = await User.create({ name, email, password, role });

  if (role === "mentor") {
    await MentorProfile.create({ userId: user._id });
  }

  if (role === "mentee") {
    await MenteeProfile.create({ userId: user._id });
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Registration successful",
    data: buildAuthPayload(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  if (user.isBlocked) {
    throw new ApiError(StatusCodes.FORBIDDEN, "This account has been blocked");
  }

  sendResponse(res, {
    message: "Login successful",
    data: buildAuthPayload(user),
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  let profile = null;
  if (req.user.role === "mentor") {
    profile = await MentorProfile.findOne({ userId: req.user._id }).populate("category");
  }
  if (req.user.role === "mentee") {
    profile = await MenteeProfile.findOne({ userId: req.user._id });
  }

  sendResponse(res, {
    data: {
      user: req.user,
      profile,
    },
  });
});
