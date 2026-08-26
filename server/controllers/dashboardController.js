import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import Category from '../models/Category.js';

// @desc    Get comprehensive Admin dashboard statistics and chart datasets
// @route   GET /api/dashboard/admin
// @access  Private (Admin only)
export const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalComplaints,
      pendingComplaints,
      underReviewComplaints,
      assignedComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      reopenedComplaints,
      totalStudents,
      totalStaff,
      allFeedbacks,
      allComplaints,
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Under Review' }),
      Complaint.countDocuments({ status: 'Assigned' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: 'Rejected' }),
      Complaint.countDocuments({ status: 'Reopened' }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'staff' }),
      Feedback.find().select('rating'),
      Complaint.find().select('category status priority createdAt resolvedAt'),
    ]);

    // Average rating
    const totalRatingSum = allFeedbacks.reduce((acc, f) => acc + f.rating, 0);
    const averageRating =
      allFeedbacks.length > 0
        ? parseFloat((totalRatingSum / allFeedbacks.length).toFixed(1))
        : 0;

    // Complaints by Category
    const categoryCounts = {};
    allComplaints.forEach((c) => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const categoryColors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#6366f1',
      '#84cc16', '#a855f7', '#64748b', '#0ea5e9', '#e11d48'
    ];

    const categoryChartData = Object.entries(categoryCounts).map(
      ([name, count], index) => ({
        name,
        count,
        fill: categoryColors[index % categoryColors.length],
      })
    );

    // Complaints by Status
    const statusChartData = [
      { status: 'Pending', count: pendingComplaints, color: '#eab308' },
      { status: 'Under Review', count: underReviewComplaints, color: '#3b82f6' },
      { status: 'Assigned', count: assignedComplaints, color: '#6366f1' },
      { status: 'In Progress', count: inProgressComplaints, color: '#f97316' },
      { status: 'Resolved', count: resolvedComplaints, color: '#10b981' },
      { status: 'Rejected', count: rejectedComplaints, color: '#ef4444' },
      { status: 'Reopened', count: reopenedComplaints, color: '#8b5cf6' },
    ];

    // Priority Distribution
    const priorityCounts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    allComplaints.forEach((c) => {
      if (priorityCounts[c.priority] !== undefined) {
        priorityCounts[c.priority]++;
      }
    });

    const priorityChartData = [
      { priority: 'Low', count: priorityCounts.Low, color: '#10b981' },
      { priority: 'Medium', count: priorityCounts.Medium, color: '#3b82f6' },
      { priority: 'High', count: priorityCounts.High, color: '#f97316' },
      { priority: 'Critical', count: priorityCounts.Critical, color: '#ef4444' },
    ];

    // Monthly Complaints trend (past 6 months)
    const monthlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const count = allComplaints.filter((c) => {
        const created = new Date(c.createdAt);
        return created >= startOfMonth && created <= endOfMonth;
      }).length;

      const resolved = allComplaints.filter((c) => {
        if (!c.resolvedAt) return false;
        const resDate = new Date(c.resolvedAt);
        return resDate >= startOfMonth && resDate <= endOfMonth;
      }).length;

      monthlyData.push({
        month: monthLabel,
        total: count,
        resolved: resolved,
      });
    }

    // Recent 5 complaints
    const recentComplaints = await Complaint.find()
      .populate('student', 'name email studentId')
      .populate('assignedStaff', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 feedbacks
    const recentFeedback = await Feedback.find()
      .populate('student', 'name')
      .populate('complaint', 'complaintId title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalComplaints,
        pendingComplaints,
        underReviewComplaints,
        assignedComplaints,
        inProgressComplaints,
        resolvedComplaints,
        rejectedComplaints,
        reopenedComplaints,
        totalStudents,
        totalStaff,
        averageRating,
        totalFeedbacks: allFeedbacks.length,
      },
      charts: {
        categoryChartData,
        statusChartData,
        priorityChartData,
        monthlyData,
      },
      recentComplaints,
      recentFeedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Student dashboard statistics
// @route   GET /api/dashboard/student
// @access  Private (Student)
export const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const [
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      recentComplaints,
    ] = await Promise.all([
      Complaint.countDocuments({ student: studentId }),
      Complaint.countDocuments({ student: studentId, status: { $in: ['Pending', 'Under Review'] } }),
      Complaint.countDocuments({ student: studentId, status: { $in: ['Assigned', 'In Progress', 'Reopened'] } }),
      Complaint.countDocuments({ student: studentId, status: 'Resolved' }),
      Complaint.countDocuments({ student: studentId, status: 'Rejected' }),
      Complaint.find({ student: studentId })
        .populate('assignedStaff', 'name department')
        .populate('feedback', 'rating')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      success: true,
      stats: {
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        rejectedComplaints,
      },
      recentComplaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Staff dashboard statistics
// @route   GET /api/dashboard/staff
// @access  Private (Staff)
export const getStaffDashboard = async (req, res, next) => {
  try {
    const staffId = req.user._id;

    const [
      totalAssigned,
      pendingAction,
      inProgress,
      resolved,
      recentComplaints,
    ] = await Promise.all([
      Complaint.countDocuments({ assignedStaff: staffId }),
      Complaint.countDocuments({ assignedStaff: staffId, status: { $in: ['Assigned', 'Under Review'] } }),
      Complaint.countDocuments({ assignedStaff: staffId, status: { $in: ['In Progress', 'Reopened'] } }),
      Complaint.countDocuments({ assignedStaff: staffId, status: 'Resolved' }),
      Complaint.find({ assignedStaff: staffId })
        .populate('student', 'name email department')
        .sort({ updatedAt: -1 })
        .limit(5),
    ]);

    res.json({
      success: true,
      stats: {
        totalAssigned,
        pendingAction,
        inProgress,
        resolved,
      },
      recentComplaints,
    });
  } catch (error) {
    next(error);
  }
};
