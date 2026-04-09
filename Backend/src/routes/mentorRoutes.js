import { Router } from "express";
import {
  getMentorById,
  getMentorDashboard,
  getMentors,
} from "../controllers/mentorController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getMentors);
router.get("/dashboard", protect, authorize("mentor"), getMentorDashboard);
router.get("/:id", getMentorById);

export default router;
