import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  updateStatus,
  assignStaff,
  addResponse,
  reopenComplaint,
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Complaints collection
router
  .route('/')
  .post(protect, authorize('student'), upload.array('evidence', 5), createComplaint)
  .get(protect, getComplaints);

// Specific complaint operations
router
  .route('/:id')
  .get(protect, getComplaintById)
  .put(protect, upload.array('evidence', 5), updateComplaint)
  .delete(protect, deleteComplaint);

// Status, Assignment, and Response routes
router.put('/:id/status', protect, authorize('staff', 'admin'), updateStatus);
router.put('/:id/assign', protect, authorize('admin'), assignStaff);
router.post('/:id/response', protect, addResponse);
router.post('/:id/reopen', protect, authorize('student', 'admin'), reopenComplaint);

export default router;
