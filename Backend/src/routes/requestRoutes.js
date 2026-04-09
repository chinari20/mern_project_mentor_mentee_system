import { Router } from "express";
import {
  createRequest,
  getRequests,
  updateRequestStatus,
} from "../controllers/requestController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getRequests);
router.post("/", protect, authorize("mentee"), createRequest);
router.patch("/:id", protect, updateRequestStatus);

export default router;
