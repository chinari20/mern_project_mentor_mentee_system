import { Router } from "express";
import {
  createConversation,
  findConversation,
  getConversationsByUser,
} from "../controllers/conversationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createConversation);
router.get("/find/:firstUserId/:secondUserId", protect, findConversation);
router.get("/:userId", protect, getConversationsByUser);

export default router;
