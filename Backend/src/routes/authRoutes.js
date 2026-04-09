import { Router } from "express";
import { body } from "express-validator";
import { getCurrentUser, login, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["mentor", "mentee"]),
    validateRequest,
  ],
  register,
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty(), validateRequest],
  login,
);

router.get("/me", protect, getCurrentUser);

export default router;
