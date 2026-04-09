import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ApiError(StatusCodes.BAD_REQUEST, "Validation failed", errors.array()),
    );
  }
  next();
};
