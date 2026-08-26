import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

// @desc    Get all users with search, role filtering, pagination
// @route   GET /api/users
// @access  Private (Admin only)
export const getUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      department,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { studentId: searchRegex },
        { department: searchRegex },
        { phone: searchRegex },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all staff members with assigned complaint workload
// @route   GET /api/users/staff/workload
// @access  Private (Admin)
export const getStaffMembers = async (req, res, next) => {
  try {
    const staffMembers = await User.find({ role: 'staff' }).select('-password');

    // Calculate assigned complaints count for each staff member
    const staffWithWorkload = await Promise.all(
      staffMembers.map(async (staff) => {
        const activeComplaintsCount = await Complaint.countDocuments({
          assignedStaff: staff._id,
          status: { $in: ['Assigned', 'In Progress', 'Under Review'] },
        });

        const totalAssignedCount = await Complaint.countDocuments({
          assignedStaff: staff._id,
        });

        return {
          ...staff.toObject(),
          activeComplaintsCount,
          totalAssignedCount,
        };
      })
    );

    res.json({
      success: true,
      staff: staffWithWorkload,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin only)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Get user complaint stats
    let userStats = {};
    if (user.role === 'student') {
      const totalComplaints = await Complaint.countDocuments({ student: user._id });
      const resolvedComplaints = await Complaint.countDocuments({
        student: user._id,
        status: 'Resolved',
      });
      userStats = { totalComplaints, resolvedComplaints };
    } else if (user.role === 'staff') {
      const assignedTotal = await Complaint.countDocuments({ assignedStaff: user._id });
      const assignedResolved = await Complaint.countDocuments({
        assignedStaff: user._id,
        status: 'Resolved',
      });
      userStats = { assignedTotal, assignedResolved };
    }

    res.json({
      success: true,
      user,
      stats: userStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new staff / student / admin user by Admin
// @route   POST /api/users
// @access  Private (Admin only)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, studentId, department, year, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and role.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      studentId: studentId ? studentId.trim() : undefined,
      department: department ? department.trim() : 'General',
      year: year || 'Faculty/Staff',
      phone: phone ? phone.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: `${role.toUpperCase()} user '${newUser.name}' created successfully!`,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        year: newUser.year,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details by Admin
// @route   PUT /api/users/:id
// @access  Private (Admin only)
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, department, year, phone, studentId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role) user.role = role;
    if (department) user.department = department.trim();
    if (year) user.year = year;
    if (phone !== undefined) user.phone = phone.trim();
    if (studentId !== undefined) user.studentId = studentId.trim();

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'User updated successfully!',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        year: updatedUser.year,
        phone: updatedUser.phone,
        studentId: updatedUser.studentId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user by Admin (preserves complaint integrity)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent deleting oneself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `User '${user.name}' has been deleted.`,
    });
  } catch (error) {
    next(error);
  }
};
