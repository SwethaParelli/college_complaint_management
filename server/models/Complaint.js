import mongoose from 'mongoose';

const responseSubSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderRole: {
    type: String,
    enum: ['student', 'staff', 'admin'],
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Response message is required'],
    trim: true,
  },
  isOfficial: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const timelineSubSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: [
      'Pending',
      'Under Review',
      'Assigned',
      'In Progress',
      'Resolved',
      'Rejected',
      'Reopened',
    ],
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedByName: {
    type: String,
    default: 'System',
  },
  updatedByRole: {
    type: String,
    default: 'System',
  },
  remark: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required (e.g. Block A, Room 302, Hostel 2, Library)'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Under Review',
        'Assigned',
        'In Progress',
        'Resolved',
        'Rejected',
        'Reopened',
      ],
      default: 'Pending',
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    evidence: [
      {
        type: String,
      },
    ],
    anonymous: {
      type: Boolean,
      default: false,
    },
    responses: [responseSubSchema],
    timeline: [timelineSubSchema],
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for performant search and dashboard metrics
complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ title: 'text', description: 'text', complaintId: 'text' });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
