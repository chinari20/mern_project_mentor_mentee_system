import { Router } from "express";
import {
  createSession,
  getSessions,
  updateSession,
} from "../controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getSessions);
router.post("/", protect, createSession);
router.patch("/:id", protect, updateSession);

export default router;
