import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import {
  submitContactQuery,
  getAllContactQueries,
  resolveContactQuery,
  getContactQueryById,
  deleteContactQuery,
} from '../controllers/contactController.js';

const router = express.Router();

// ==================== VALIDATION RULES ====================

const submitValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
];

// ==================== PUBLIC ROUTES ====================

// Submit a contact query (anyone can access)
router.post('/', submitValidation, submitContactQuery);

// ==================== ADMIN-ONLY ROUTES ====================

// Get all contact queries (requires admin role)
router.get('/', protect, authorize('admin'), getAllContactQueries);

// Get single query by ID
router.get('/:id', protect, authorize('admin'), getContactQueryById);

// Resolve a query
router.put('/:id/resolve', protect, authorize('admin'), resolveContactQuery);

// Delete a query (optional - if you want admins to be able to delete)
router.delete('/:id', protect, authorize('admin'), deleteContactQuery);

export default router;