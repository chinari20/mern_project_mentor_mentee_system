import { Router } from "express";
import {
  getMyProfile,
  toggleFavoriteMentor,
  updateMyProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);
router.patch("/favorites/:mentorId", protect, toggleFavoriteMentor);

export default router;
