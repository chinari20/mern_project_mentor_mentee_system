import { Router } from "express";
import {
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:conversationId", protect, getMessages);
router.post("/", protect, sendMessage);

export default router;
