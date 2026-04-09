import { Router } from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getConversations);
router.get("/:userId", protect, getMessages);
router.post("/", protect, sendMessage);

export default router;
