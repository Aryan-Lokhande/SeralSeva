import express from 'express';
import {
  submitGrievance,
  getMyGrievances,
  trackGrievance,
  getGrievance,
  getAllGrievances,
  updateGrievanceStatus,
  assignGrievance,
  uploadAttachments,
  submitFeedback,
  getGrievanceStats,
} from '../controllers/grievanceController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// User routes
router.post('/', protect, submitGrievance);
router.get('/my-grievances', protect, getMyGrievances);
router.get('/track/:trackingId', protect, trackGrievance);
router.get('/:id', protect, getGrievance);
router.post('/:id/attachments', protect, upload.array('attachments', 5), uploadAttachments);
router.post('/:id/feedback', protect, submitFeedback);

// Admin routes
router.get('/', protect, authorize('admin'), getAllGrievances);
router.put('/:id/status', protect, authorize('admin'), updateGrievanceStatus);
router.put('/:id/assign', protect, authorize('admin'), assignGrievance);
router.get('/stats/overview', protect, authorize('admin'), getGrievanceStats);

export default router;
