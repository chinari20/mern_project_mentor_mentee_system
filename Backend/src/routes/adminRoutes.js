import { Router } from "express";
import {
  approveMentor,
  createCategory,
  getAdminDashboard,
  getCategories,
  getPendingMentors,
  getUsers,
  toggleBlockUser,
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/dashboard", getAdminDashboard);
router.get("/users", getUsers);
router.patch("/users/:id/toggle-block", toggleBlockUser);
router.get("/mentor-approvals", getPendingMentors);
router.patch("/mentor-approvals/:id", approveMentor);
router.get("/categories", getCategories);
router.post("/categories", createCategory);

export default router;
