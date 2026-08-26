import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { generateComplaintId } from '../utils/generateComplaintId.js';

// Helper to notify admins
const notifyAdmins = async (title, message, complaintId, complaintDocId, senderId) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      sender: senderId,
      complaint: complaintDocId,
      complaintId,
      title,
      message,
      type: 'complaint_created',
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (err) {
    console.error('Failed to notify admins:', err.message);
  }
};

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, location, priority, anonymous } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complaint title, description, category, and location.',
      });
    }

    // Auto-generate sequential Complaint ID (e.g. CMP-2026-0001)
    const complaintId = await generateComplaintId();

    // Process uploaded evidence files
    let evidenceFiles = [];
    if (req.files && req.files.length > 0) {
      evidenceFiles = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // Initialize complaint with first timeline status 'Submitted'
    const complaint = await Complaint.create({
      complaintId,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      location: location.trim(),
      priority: priority || 'Medium',
      status: 'Pending',
      student: req.user._id,
      anonymous: anonymous === 'true' || anonymous === true,
      evidence: evidenceFiles,
      timeline: [
        {
          status: 'Pending',
          updatedBy: req.user._id,
          updatedByName: req.user.name,
          updatedByRole: req.user.role,
          remark: 'Complaint submitted by student.',
          timestamp: new Date(),
        },
      ],
    });

    // Notify admins about the new complaint
    await notifyAdmins(
      `New Complaint Submitted (${complaintId})`,
      `${req.user.name} submitted a complaint under category '${category}': "${title.substring(0, 50)}..."`,
      complaintId,
      complaint._id,
      req.user._id
    );

    // Also create a confirmation notification for the student
    await Notification.create({
      recipient: req.user._id,
      complaint: complaint._id,
      complaintId,
      title: 'Complaint Registered',
      message: `Your complaint ${complaintId} has been successfully registered. You can track its live progress here.`,
      type: 'complaint_created',
    });

    res.status(201).json({
      success: true,
      message: `Complaint ${complaintId} has been submitted successfully!`,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints with search, filters, pagination, and role scoping
// @route   GET /api/complaints
// @access  Private
export const getComplaints = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      priority,
      assignedStaff,
      studentId,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build query filter
    const query = {};

    // Role-based scoping
    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.user.role === 'staff') {
      query.assignedStaff = req.user._id;
    } else if (req.user.role === 'admin') {
      if (assignedStaff) query.assignedStaff = assignedStaff;
      if (studentId) query.student = studentId;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Search filter across complaintId, title, description, location
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { complaintId: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { category: searchRegex },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('student', 'name email studentId department year phone')
      .populate('assignedStaff', 'name email department phone')
      .populate('feedback', 'rating comment')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Mask student info if anonymous and viewer is not admin
    const sanitizedComplaints = complaints.map((c) => {
      const doc = c.toObject();
      if (doc.anonymous && req.user.role !== 'admin') {
        doc.student = {
          name: 'Anonymous Student',
          email: 'anonymous@college.edu',
          studentId: 'HIDDEN',
          department: doc.student?.department || 'Confidential',
          year: 'Confidential',
        };
      }
      return doc;
    });

    res.json({
      success: true,
      count: sanitizedComplaints.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      complaints: sanitizedComplaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint by ID or complaintId
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Support both MongoDB ObjectId and custom complaintId (e.g. CMP-2026-0001)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { complaintId: id };

    const complaint = await Complaint.findOne(query)
      .populate('student', 'name email studentId department year phone profileImage')
      .populate('assignedStaff', 'name email department phone profileImage')
      .populate('feedback', 'rating comment createdAt')
      .populate('timeline.updatedBy', 'name role')
      .populate('responses.sender', 'name role profileImage');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID ${id}.`,
      });
    }

    // Role-based access check
    if (
      req.user.role === 'student' &&
      complaint.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only view your own complaints.',
      });
    }

    if (
      req.user.role === 'staff' &&
      (!complaint.assignedStaff ||
        complaint.assignedStaff._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only view complaints assigned to you.',
      });
    }

    const doc = complaint.toObject();

    // Mask student info if anonymous and viewer is not admin
    if (doc.anonymous && req.user.role !== 'admin') {
      doc.student = {
        _id: doc.student?._id,
        name: 'Anonymous Student',
        email: 'anonymous@college.edu',
        studentId: 'HIDDEN',
        department: doc.student?.department || 'Confidential',
        year: 'Confidential',
        phone: 'Hidden',
      };
    }

    res.json({
      success: true,
      complaint: doc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint details (Student can update if still Pending)
// @route   PUT /api/complaints/:id
// @access  Private
export const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (
      req.user.role === 'student' &&
      complaint.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only update your own complaints.',
      });
    }

    if (req.user.role === 'student' && complaint.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'You can only edit complaints that are in Pending status.',
      });
    }

    const { title, description, category, location, priority, anonymous } = req.body;

    if (title) complaint.title = title.trim();
    if (description) complaint.description = description.trim();
    if (category) complaint.category = category.trim();
    if (location) complaint.location = location.trim();
    if (priority) complaint.priority = priority;
    if (anonymous !== undefined) complaint.anonymous = anonymous === 'true' || anonymous === true;

    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map((file) => `/uploads/${file.filename}`);
      complaint.evidence.push(...newFiles);
    }

    const updated = await complaint.save();

    res.json({
      success: true,
      message: 'Complaint updated successfully!',
      complaint: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Staff or Admin)
export const updateStatus = async (req, res, next) => {
  try {
    const { status, remark } = req.body;

    const validStatuses = [
      'Pending',
      'Under Review',
      'Assigned',
      'In Progress',
      'Resolved',
      'Rejected',
      'Reopened',
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Permission check for staff
    if (req.user.role === 'staff') {
      if (
        !complaint.assignedStaff ||
        complaint.assignedStaff.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only update status for complaints assigned to you.',
        });
      }
    }

    const oldStatus = complaint.status;
    complaint.status = status;

    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    }

    // Record timeline entry
    complaint.timeline.push({
      status,
      updatedBy: req.user._id,
      updatedByName: req.user.name,
      updatedByRole: req.user.role,
      remark: remark || `Status updated from ${oldStatus} to ${status}.`,
      timestamp: new Date(),
    });

    await complaint.save();

    // Create notification for the student
    await Notification.create({
      recipient: complaint.student,
      sender: req.user._id,
      complaint: complaint._id,
      complaintId: complaint.complaintId,
      title: `Complaint Status Updated: ${status}`,
      message: `Your complaint ${complaint.complaintId} status has changed to "${status}". Remark: ${remark || 'No extra remark.'}`,
      type: status === 'Resolved' ? 'resolved' : status === 'Rejected' ? 'rejected' : 'status_changed',
    });

    res.json({
      success: true,
      message: `Complaint status updated to ${status}.`,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign complaint to a staff member
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin only)
export const assignStaff = async (req, res, next) => {
  try {
    const { staffId, remark } = req.body;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a staff member to assign.',
      });
    }

    const staffMember = await User.findOne({ _id: staffId, role: 'staff' });
    if (!staffMember) {
      return res.status(404).json({
        success: false,
        message: 'Selected staff member was not found.',
      });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    complaint.assignedStaff = staffMember._id;
    complaint.status = 'Assigned';

    // Record timeline
    complaint.timeline.push({
      status: 'Assigned',
      updatedBy: req.user._id,
      updatedByName: req.user.name,
      updatedByRole: req.user.role,
      remark: remark || `Assigned to ${staffMember.name} (${staffMember.department}).`,
      timestamp: new Date(),
    });

    await complaint.save();

    // Notify assigned staff
    await Notification.create({
      recipient: staffMember._id,
      sender: req.user._id,
      complaint: complaint._id,
      complaintId: complaint.complaintId,
      title: 'New Complaint Assigned',
      message: `You have been assigned to handle complaint ${complaint.complaintId}: "${complaint.title}".`,
      type: 'staff_assigned',
    });

    // Notify student
    await Notification.create({
      recipient: complaint.student,
      sender: req.user._id,
      complaint: complaint._id,
      complaintId: complaint.complaintId,
      title: 'Complaint Assigned to Staff',
      message: `Your complaint ${complaint.complaintId} has been assigned to ${staffMember.name} (${staffMember.department}).`,
      type: 'staff_assigned',
    });

    res.json({
      success: true,
      message: `Complaint assigned to ${staffMember.name} successfully!`,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add official or student response to complaint
// @route   POST /api/complaints/:id/response
// @access  Private
export const addResponse = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Response message cannot be empty.',
      });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Role-based participation check
    if (
      req.user.role === 'student' &&
      complaint.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot respond to this complaint.',
      });
    }

    if (
      req.user.role === 'staff' &&
      (!complaint.assignedStaff ||
        complaint.assignedStaff.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only respond to complaints assigned to you.',
      });
    }

    const responseObj = {
      sender: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      message: message.trim(),
      isOfficial: req.user.role === 'admin' || req.user.role === 'staff',
      createdAt: new Date(),
    };

    complaint.responses.push(responseObj);
    await complaint.save();

    // Send notifications to counterpart
    if (req.user.role === 'student') {
      if (complaint.assignedStaff) {
        await Notification.create({
          recipient: complaint.assignedStaff,
          sender: req.user._id,
          complaint: complaint._id,
          complaintId: complaint.complaintId,
          title: 'Student Responded',
          message: `Student sent a response on complaint ${complaint.complaintId}: "${message.substring(0, 60)}..."`,
          type: 'response_added',
        });
      }
    } else {
      // Admin or Staff replied -> notify student
      await Notification.create({
        recipient: complaint.student,
        sender: req.user._id,
        complaint: complaint._id,
        complaintId: complaint.complaintId,
        title: 'New Official Response',
        message: `${req.user.name} (${req.user.role.toUpperCase()}) replied to your complaint ${complaint.complaintId}.`,
        type: 'response_added',
      });
    }

    res.json({
      success: true,
      message: 'Response added successfully!',
      responses: complaint.responses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reopen a resolved/rejected complaint
// @route   POST /api/complaints/:id/reopen
// @access  Private (Student or Admin)
export const reopenComplaint = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (
      req.user.role === 'student' &&
      complaint.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only reopen your own complaints.',
      });
    }

    if (complaint.status !== 'Resolved' && complaint.status !== 'Rejected') {
      return res.status(400).json({
        success: false,
        message: 'Only Resolved or Rejected complaints can be reopened.',
      });
    }

    complaint.status = 'Reopened';
    complaint.resolvedAt = null;

    complaint.timeline.push({
      status: 'Reopened',
      updatedBy: req.user._id,
      updatedByName: req.user.name,
      updatedByRole: req.user.role,
      remark: reason || 'Complaint reopened by user for further investigation.',
      timestamp: new Date(),
    });

    await complaint.save();

    // Notify admins and assigned staff
    if (complaint.assignedStaff) {
      await Notification.create({
        recipient: complaint.assignedStaff,
        sender: req.user._id,
        complaint: complaint._id,
        complaintId: complaint.complaintId,
        title: 'Complaint Reopened',
        message: `Complaint ${complaint.complaintId} has been reopened: "${reason || 'No specific reason given.'}"`,
        type: 'reopened',
      });
    }

    res.json({
      success: true,
      message: `Complaint ${complaint.complaintId} has been reopened.`,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint (Admin can delete any; Student can delete if status is Pending)
// @route   DELETE /api/complaints/:id
// @access  Private
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (req.user.role === 'student') {
      if (complaint.student.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You cannot delete this complaint.',
        });
      }
      if (complaint.status !== 'Pending') {
        return res.status(400).json({
          success: false,
          message: 'You can only delete complaints that are in Pending status.',
        });
      }
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Complaint ${complaint.complaintId} deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
