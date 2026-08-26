import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Category from '../models/Category.js';
import Feedback from '../models/Feedback.js';
import Notification from '../models/Notification.js';
import Counter from '../models/Counter.js';
import { connectDB, closeDB } from '../config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Complaint.deleteMany({}),
      Category.deleteMany({}),
      Feedback.deleteMany({}),
      Notification.deleteMany({}),
      Counter.deleteMany({}),
    ]);

    console.log('👤 Seeding Users (Admin, Staff, Students)...');

    // Default password hash
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    const staffPasswordHash = await bcrypt.hash('Staff@123', 10);
    const studentPasswordHash = await bcrypt.hash('Student@123', 10);

    // 1. Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@college.com',
      password: 'Admin@123',
      role: 'admin',
      department: 'Administration',
      year: 'Admin',
      phone: '+91 98765 43210',
    });

    // 2. Staff
    const staff1 = await User.create({
      name: 'Prof. Rajesh Sharma',
      email: 'prof.sharma@college.com',
      password: 'Staff@123',
      role: 'staff',
      department: 'Infrastructure & Facilities',
      year: 'Faculty/Staff',
      phone: '+91 98111 22334',
    });

    const staff2 = await User.create({
      name: 'Prof. Ananya Patel',
      email: 'prof.patel@college.com',
      password: 'Staff@123',
      role: 'staff',
      department: 'Academic & Examination',
      year: 'Faculty/Staff',
      phone: '+91 98222 33445',
    });

    // 3. Students
    const student1 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul.verma@college.com',
      password: 'Student@123',
      role: 'student',
      studentId: 'CS-2023-042',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      phone: '+91 98333 44556',
    });

    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@college.com',
      password: 'Student@123',
      role: 'student',
      studentId: 'IT-2024-018',
      department: 'Information Technology',
      year: '2nd Year',
      phone: '+91 98444 55667',
    });

    const student3 = await User.create({
      name: 'Amit Kumar',
      email: 'amit.kumar@college.com',
      password: 'Student@123',
      role: 'student',
      studentId: 'EC-2022-091',
      department: 'Electronics & Communication',
      year: '4th Year',
      phone: '+91 98555 66778',
    });

    const student4 = await User.create({
      name: 'Sneha Patel',
      email: 'sneha.patel@college.com',
      password: 'Student@123',
      role: 'student',
      studentId: 'ME-2025-005',
      department: 'Mechanical Engineering',
      year: '1st Year',
      phone: '+91 98666 77889',
    });

    const student5 = await User.create({
      name: 'Vikram Singh',
      email: 'vikram.singh@college.com',
      password: 'Student@123',
      role: 'student',
      studentId: 'CE-2023-077',
      department: 'Civil Engineering',
      year: '3rd Year',
      phone: '+91 98777 88990',
    });

    console.log('🏷️ Seeding 15 Complaint Categories...');
    const defaultCategories = [
      { name: 'Academic', description: 'Curriculum, lectures, schedule, and syllabus concerns', icon: 'book-open' },
      { name: 'Faculty', description: 'Faculty behavior, attendance, and teaching issues', icon: 'users' },
      { name: 'Infrastructure', description: 'Classrooms, benches, projectors, boards, and building repairs', icon: 'building' },
      { name: 'Hostel', description: 'Hostel room issues, wardens, mess, and maintenance', icon: 'home' },
      { name: 'Canteen', description: 'Food hygiene, pricing, quality, and canteen services', icon: 'utensils' },
      { name: 'Transportation', description: 'College buses, routes, timings, and transit passes', icon: 'bus' },
      { name: 'Library', description: 'Book availability, digital library, quiet zones, and access', icon: 'library' },
      { name: 'Laboratory', description: 'Lab equipment, chemical supplies, software licenses, computers', icon: 'flask-conical' },
      { name: 'Internet/Wi-Fi', description: 'Campus Wi-Fi connectivity, speed, hotspot, and portal logins', icon: 'wifi' },
      { name: 'Cleanliness', description: 'Sanitation, washrooms, dustbins, and campus cleanliness', icon: 'sparkles' },
      { name: 'Security', description: 'Campus safety, entry gates, ID card checks, and emergency help', icon: 'shield-check' },
      { name: 'Electricity', description: 'Power cuts, generator backups, lighting, fans, and ACs', icon: 'zap' },
      { name: 'Water Supply', description: 'Water coolers, RO purification, hostel water, washrooms', icon: 'droplet' },
      { name: 'Examination', description: 'Hall tickets, exam scheduling, grade discrepancies, re-eval', icon: 'file-text' },
      { name: 'Other', description: 'General grievances and miscellaneous suggestions', icon: 'help-circle' },
    ];

    await Category.insertMany(defaultCategories);

    console.log('📝 Seeding Initial Counter for Complaint IDs...');
    const currentYear = new Date().getFullYear();
    await Counter.create({
      id: `complaint_${currentYear}`,
      seq: 10, // Starting offset so generated IDs start after seed batch
    });

    console.log('📌 Seeding Sample Realistic Complaints with Timelines & Feedback...');

    // Complaint 1 - Resolved with 5-star Feedback
    const comp1 = await Complaint.create({
      complaintId: `CMP-${currentYear}-0001`,
      title: 'Lab 304 High-Performance Workstation OS Crash',
      description: 'Multiple Linux machines in Lab 304 are encountering kernel panics and failing to mount the NFS home directories during CS301 lab sessions.',
      category: 'Laboratory',
      location: 'Block B, 3rd Floor, Computer Lab 304',
      priority: 'High',
      status: 'Resolved',
      student: student1._id,
      assignedStaff: staff1._id,
      anonymous: false,
      evidence: [],
      resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      timeline: [
        {
          status: 'Pending',
          updatedBy: student1._id,
          updatedByName: student1.name,
          updatedByRole: 'student',
          remark: 'Complaint submitted with lab system error logs.',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Under Review',
          updatedBy: admin._id,
          updatedByName: admin.name,
          updatedByRole: 'admin',
          remark: 'Reviewed by department admin. Forwarding to IT sysadmin team.',
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Assigned',
          updatedBy: admin._id,
          updatedByName: admin.name,
          updatedByRole: 'admin',
          remark: `Assigned to ${staff1.name} (Infrastructure & Facilities).`,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'In Progress',
          updatedBy: staff1._id,
          updatedByName: staff1.name,
          updatedByRole: 'staff',
          remark: 'Network file server config updated and GRUB boot parameters restored on all 30 nodes.',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Resolved',
          updatedBy: staff1._id,
          updatedByName: staff1.name,
          updatedByRole: 'staff',
          remark: 'All 30 workstations tested and verified with CS301 lab benchmark image. Ready for class.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      ],
      responses: [
        {
          sender: staff1._id,
          senderName: staff1.name,
          senderRole: 'staff',
          message: 'We inspected the switch configuration and updated the NFS mount points. Everything is functional now.',
          isOfficial: true,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    const feed1 = await Feedback.create({
      complaint: comp1._id,
      student: student1._id,
      rating: 5,
      comment: 'Prompt resolution before our lab practical examination! Thank you Prof. Rajesh.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });
    comp1.feedback = feed1._id;
    await comp1.save();

    // Complaint 2 - In Progress
    const comp2 = await Complaint.create({
      complaintId: `CMP-${currentYear}-0002`,
      title: 'Hostel Block-C 2nd Floor RO Water Purifier Malfunctioning',
      description: 'The RO water dispenser on the second floor of Hostel C is dispensing murky water and making a loud buzzing noise. Students currently have to walk down to ground floor.',
      category: 'Water Supply',
      location: 'Hostel Block-C, 2nd Floor Corridor',
      priority: 'Critical',
      status: 'In Progress',
      student: student2._id,
      assignedStaff: staff1._id,
      anonymous: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      timeline: [
        {
          status: 'Pending',
          updatedBy: student2._id,
          updatedByName: student2.name,
          updatedByRole: 'student',
          remark: 'Complaint registered by hostel resident.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Assigned',
          updatedBy: admin._id,
          updatedByName: admin.name,
          updatedByRole: 'admin',
          remark: `Priority escalated to Critical. Assigned to ${staff1.name}.`,
          timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'In Progress',
          updatedBy: staff1._id,
          updatedByName: staff1.name,
          updatedByRole: 'staff',
          remark: 'Water filtration technician dispatched with replacement carbon filters and UV lamp.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
      responses: [
        {
          sender: staff1._id,
          senderName: staff1.name,
          senderRole: 'staff',
          message: 'The technician is currently replacing the membrane filters and sanitizing the holding tank. Will be completed by this afternoon.',
          isOfficial: true,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    // Complaint 3 - Under Review (Anonymous)
    await Complaint.create({
      complaintId: `CMP-${currentYear}-0003`,
      title: 'Discrepancy in End-Semester Internal Marks Portal',
      description: 'The online ERP portal reflects 18/30 instead of the verified 28/30 internal marks for Digital Signal Processing (EC402) for Section B.',
      category: 'Examination',
      location: 'Academic Office / ERP Portal',
      priority: 'High',
      status: 'Under Review',
      student: student3._id,
      anonymous: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      timeline: [
        {
          status: 'Pending',
          updatedBy: student3._id,
          updatedByName: 'Anonymous Student',
          updatedByRole: 'student',
          remark: 'Anonymous grievance filed with mark-sheet cross reference.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Under Review',
          updatedBy: admin._id,
          updatedByName: admin.name,
          updatedByRole: 'admin',
          remark: 'Checking marksheet upload history in ERP database with controller of examinations.',
          timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    // Complaint 4 - Pending
    await Complaint.create({
      complaintId: `CMP-${currentYear}-0004`,
      title: 'Library 4th Floor Reading Hall Air Conditioning Not Working',
      description: 'The central AC in the quiet study section of 4th floor library has been down for two days. Room temperature exceeds 34°C during peak study hours.',
      category: 'Infrastructure',
      location: 'Central Library, 4th Floor Reading Hall',
      priority: 'Medium',
      status: 'Pending',
      student: student4._id,
      anonymous: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      timeline: [
        {
          status: 'Pending',
          updatedBy: student4._id,
          updatedByName: student4.name,
          updatedByRole: 'student',
          remark: 'Submitted by student via student portal.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        },
      ],
    });

    // Complaint 5 - Assigned
    await Complaint.create({
      complaintId: `CMP-${currentYear}-0005`,
      title: 'Hostel Gateway Wi-Fi DHCP Pool Exhaustion',
      description: 'Devices in Hostel Block A are failing to receive local IP addresses between 8 PM and 11 PM every evening.',
      category: 'Internet/Wi-Fi',
      location: 'Hostel Block A & Common Area',
      priority: 'High',
      status: 'Assigned',
      student: student5._id,
      assignedStaff: staff1._id,
      anonymous: false,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      timeline: [
        {
          status: 'Pending',
          updatedBy: student5._id,
          updatedByName: student5.name,
          updatedByRole: 'student',
          remark: 'Complaint filed.',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
        {
          status: 'Assigned',
          updatedBy: admin._id,
          updatedByName: admin.name,
          updatedByRole: 'admin',
          remark: `Assigned to ${staff1.name} to expand subnet mask.`,
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        },
      ],
    });

    // Complaint 6 - Rejected
    await Complaint.create({
      complaintId: `CMP-${currentYear}-0006`,
      title: 'Request to Extend Main Gate Curfew to 2:00 AM',
      description: 'Hostel students want gate closing time pushed from 10:00 PM to 2:00 AM permanently without parent permission.',
      category: 'Security',
      location: 'Main Campus Security Gate',
      priority: 'Low',
      status: 'Rejected',
      student: student1._id,
      anonymous: false,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      timeline: [
        {
          status: 'Pending',
          updatedBy: student1._id,
          updatedByName: student1.name,
          updatedByRole: 'student',
          remark: 'Complaint submitted.',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Rejected',
          updatedBy: admin._id,
          updatedByName: admin.name,
          updatedByRole: 'admin',
          remark: 'Institutional safety protocol mandates 10:00 PM hostel check-in. Curfew adjustments require Board of Regents approval.',
          timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        },
      ],
      responses: [
        {
          sender: admin._id,
          senderName: admin.name,
          senderRole: 'admin',
          message: 'Campus security policies cannot be altered via individual complaint tickets. Please discuss through student council.',
          isOfficial: true,
          createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    // Complaint 7 - Reopened
    await Complaint.create({
      complaintId: `CMP-${currentYear}-0007`,
      title: 'Canteen Cafeteria Overcharging for Packaged Goods',
      description: 'The vendor in Canteen 2 charges ₹10 above MRP on dairy beverages and water bottles.',
      category: 'Canteen',
      location: 'Central Canteen 2',
      priority: 'Medium',
      status: 'Reopened',
      student: student2._id,
      assignedStaff: staff2._id,
      anonymous: false,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      timeline: [
        {
          status: 'Pending',
          updatedBy: student2._id,
          updatedByName: student2.name,
          updatedByRole: 'student',
          remark: 'Initial complaint filed.',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Resolved',
          updatedBy: staff2._id,
          updatedByName: staff2.name,
          updatedByRole: 'staff',
          remark: 'Vendor issued warning and signed compliance letter.',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Reopened',
          updatedBy: student2._id,
          updatedByName: student2.name,
          updatedByRole: 'student',
          remark: 'Vendor is still continuing the same practice during evening hours.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    console.log('🔔 Seeding Sample System Notifications...');
    await Notification.create([
      {
        recipient: student1._id,
        title: 'Complaint Resolved',
        message: `Your complaint CMP-${currentYear}-0001 (Lab 304 Workstation) was successfully resolved. Please provide feedback!`,
        type: 'resolved',
        read: false,
      },
      {
        recipient: staff1._id,
        title: 'New Assignment',
        message: `You were assigned complaint CMP-${currentYear}-0002 (Hostel C RO Water Purifier).`,
        type: 'staff_assigned',
        read: false,
      },
      {
        recipient: admin._id,
        title: 'New Complaint Registered',
        message: `Student registered CMP-${currentYear}-0004 (Library AC) under Infrastructure.`,
        type: 'complaint_created',
        read: true,
      },
    ]);

    console.log('====================================================');
    console.log(' Database Seeded Successfully!');
    console.log('====================================================');
    console.log('Demo Login Credentials:');
    console.log('----------------------------------------------------');
    console.log('🛡️ ADMIN:   admin@college.com        | Admin@123');
    console.log('👨‍🏫 STAFF 1: prof.sharma@college.com  | Staff@123');
    console.log('👨‍🏫 STAFF 2: prof.patel@college.com   | Staff@123');
    console.log('👨‍🎓 STUDENT: rahul.verma@college.com  | Student@123');
    console.log('👨‍🎓 STUDENT: priya.sharma@college.com | Student@123');
    console.log('====================================================');

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    await closeDB();
    process.exit(1);
  }
};

seedDatabase();
