import express from 'express';
import {
  getAdminDashboard,
  getStudentDashboard,
  getStaffDashboard,
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/student', protect, authorize('student'), getStudentDashboard);
router.get('/staff', protect, authorize('staff'), getStaffDashboard);

export default router;
