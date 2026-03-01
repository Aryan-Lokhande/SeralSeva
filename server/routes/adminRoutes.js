import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getBadgeStats, updateAdminSettings } from '../controllers/adminController.js';
import { getUserById } from '../controllers/userController.js';

const router = express.Router();

// All routes require admin role
router.use(protect, authorize('admin'));

// Get badge counts
router.get('/badge-stats', getBadgeStats);

// Update admin settings
router.put('/settings', updateAdminSettings);

router.get('/:id', getUserById);

export default router;