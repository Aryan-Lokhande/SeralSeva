import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getBadgeStats, updateAdminSettings } from '../controllers/adminController.js';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// All routes require admin role
router.use(protect, authorize("admin"));

// 1. Static Routes (Place these first)
router.get("/badge-stats", getBadgeStats);
router.get("/", getAllUsers);

// 2. Admin Settings
router.put("/settings", updateAdminSettings);

// 3. Parameterized Routes (Place these last)
router.get("/:id", getUserById);
router.put("/:id/role", updateUserRole);
router.put("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

export default router;