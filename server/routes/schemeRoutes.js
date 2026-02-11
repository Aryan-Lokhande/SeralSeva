import express from "express";
import {
  getSchemes,
  getScheme,
  createScheme,
  updateScheme,
  deleteScheme,
  getCategories,
  getSchemeStats,
} from "../controllers/schemeController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getSchemes);
router.get("/categories/all", getCategories);
router.get("/stats/overview", getSchemeStats);
router.get("/:id", getScheme);

// Admin routes
router.post("/", protect, authorize("admin"), createScheme);
router.put("/:id", protect, authorize("admin"), updateScheme);
router.delete("/:id", protect, authorize("admin"), deleteScheme);

export default router;
