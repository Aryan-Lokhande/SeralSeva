import express from "express";
import {
  submitApplication,
  getMyApplications,
  getApplication,
  trackApplication,
  getAllApplications,
  updateApplicationStatus,
  uploadDocuments,
  getApplicationStats,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// User routes
router.post("/", protect, submitApplication);
router.get("/my-applications", protect, getMyApplications);
router.get("/track/:applicationId", protect, trackApplication);
router.get("/:id", protect, getApplication);
router.post(
  "/:id/documents",
  protect,
  upload.array("documents", 5),
  uploadDocuments,
);

// Admin routes
router.get("/", protect, authorize("admin"), getAllApplications);
router.put("/:id/status", protect, authorize("admin"), updateApplicationStatus);
router.get("/stats/overview", protect, authorize("admin"), getApplicationStats);

export default router;
