import Feedback from '../models/Feedback.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';

// @desc    Submit feedback/rating for a resolved complaint
// @route   POST /api/feedback
// @access  Private (Student)
export const createFeedback = async (req, res, next) => {
  try {
    const { complaintId, rating, comment } = req.body;

    if (!complaintId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both complaint ID and star rating (1-5).',
      });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5 stars.',
      });
    }

    // Find complaint
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Must be the student who submitted the complaint
    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only submit feedback for your own complaints.',
      });
    }

    // Must be resolved
    if (complaint.status !== 'Resolved') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be provided for complaints that are marked as Resolved.',
      });
    }

    // Check if feedback already submitted
    const existingFeedback = await Feedback.findOne({ complaint: complaint._id });
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted feedback for this complaint.',
      });
    }

    const feedback = await Feedback.create({
      complaint: complaint._id,
      student: req.user._id,
      rating: numericRating,
      comment: comment ? comment.trim() : '',
    });

    // Link feedback to complaint
    complaint.feedback = feedback._id;
    await complaint.save();

    // Notify assigned staff member if present
    if (complaint.assignedStaff) {
      await Notification.create({
        recipient: complaint.assignedStaff,
        sender: req.user._id,
        complaint: complaint._id,
        complaintId: complaint.complaintId,
        title: `Student Feedback Received (${numericRating} ⭐)`,
        message: `Student left a ${numericRating}-star rating for complaint ${complaint.complaintId}: "${comment || 'No comment provided.'}"`,
        type: 'feedback_received',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback records with satisfaction statistics
// @route   GET /api/feedback
// @access  Private (Admin)
export const getFeedback = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, minRating } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    const total = await Feedback.countDocuments(query);
    const feedbacks = await Feedback.find(query)
      .populate('student', 'name email studentId department')
      .populate({
        path: 'complaint',
        select: 'complaintId title category priority location resolvedAt',
        populate: {
          path: 'assignedStaff',
          select: 'name email department',
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Calculate rating distribution and average
    const allFeedbacks = await Feedback.find({});
    const totalCount = allFeedbacks.length;
    const sumRatings = allFeedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = totalCount > 0 ? (sumRatings / totalCount).toFixed(1) : 0;

    const distribution = {
      5: allFeedbacks.filter((f) => f.rating === 5).length,
      4: allFeedbacks.filter((f) => f.rating === 4).length,
      3: allFeedbacks.filter((f) => f.rating === 3).length,
      2: allFeedbacks.filter((f) => f.rating === 2).length,
      1: allFeedbacks.filter((f) => f.rating === 1).length,
    };

    res.json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      averageRating: parseFloat(averageRating),
      totalFeedbacks: totalCount,
      distribution,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};
