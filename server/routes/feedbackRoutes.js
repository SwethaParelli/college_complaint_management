import express from 'express';
import {
  createFeedback,
  getFeedback,
} from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('student'), createFeedback);
router.get('/', protect, authorize('admin'), getFeedback);

export default router;
