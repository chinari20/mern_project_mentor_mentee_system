import { Router } from "express";
import { createGoal, getGoals, updateGoal } from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getGoals);
router.post("/", protect, createGoal);
router.patch("/:id", protect, updateGoal);

export default router;
