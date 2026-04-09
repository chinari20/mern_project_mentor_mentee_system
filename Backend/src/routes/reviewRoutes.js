import { Router } from "express";
import { createReview, getReviews } from "../controllers/reviewController.js";
import { authorize, optionalProtect, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", optionalProtect, getReviews);
router.post("/", protect, authorize("mentee"), createReview);

export default router;
