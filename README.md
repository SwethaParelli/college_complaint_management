# 🎓 College Complaint Management System (CollegeResolve)

> A modern, full-stack college complaint and grievance redressal web application built for academic institutions. Suitable for B.Tech final-year project demonstration.

---

## 🌟 Project Overview

**CollegeResolve** is an end-to-end digital grievance management platform that bridges communication between students, faculty/staff, and college administrators. The platform streamlines complaint submission, automatic ticket assignment, real-time stage-by-stage progress tracking, official communication threads, institutional analytics, and post-resolution satisfaction feedback.

---

## 🚀 Key Features by User Role

### 👨‍🎓 1. Student Portal
- **Registration & Authentication**: Secure registration with Roll Number, Department, and Academic Year.
- **Complaint Submission**:
  - Auto-generated sequential Complaint ID (`CMP-YYYY-XXXX`).
  - Categorization (Academic, Hostel, Wi-Fi, Infrastructure, Laboratory, Library, Canteen, Examination, etc.).
  - Severity priority tags (*Low*, *Medium*, *High*, *Critical*).
  - Multi-file evidence attachment (JPG, PNG, PDF with previews up to 5MB).
  - **Anonymous Grievance Mode** (masks student identity from staff while maintaining tracking).
- **Interactive Live Tracking**:
  - Visual Stepper & Progress Timeline (`Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved`).
  - Chronological history activity log with timestamps and staff remarks.
- **Two-Way Official Discussion Thread**: Direct communication channel with assigned faculty.
- **Post-Resolution Rating**: 1–5 star rating and feedback comment upon resolution.
- **Ticket Reopen**: Ability to reopen unresolved or rejected tickets with rationale.

### 👨‍🏫 2. Faculty / Staff Portal
- **Dedicated Queue**: View complaints assigned specifically to their department.
- **Status Updates**: Advance tickets to *In Progress* or *Resolved* with operational notes.
- **Official Remarks**: Post replies and resolution details to students.
- **Workload & Performance Metrics**: Track assigned tickets and closed complaints.

### 🛡️ 3. College Administrator Portal
- **Executive Analytics Dashboard**:
  - Real-time Recharts visualizations:
    - *Complaints by Category* (Donut/Pie Chart)
    - *Complaints by Status* (Bar Chart)
    - *Monthly Trends & Capacity* (Area/Line Chart)
    - *Severity Distribution* (Horizontal Bar Chart)
- **All Complaints Management**:
  - Multi-filter (Search, Category, Status, Priority, Date Range, Assigned Staff).
  - Staff Assignment modal with active staff workload indicators.
  - Status updates and ticket deletion for inappropriate entries.
- **User Management**:
  - Students Directory (Search, Department filter, edit, delete).
  - Faculty & Staff In-Charge (Add new faculty/staff accounts, workload tracking).
- **Category Taxonomy Management**: Add, edit, or remove complaint categories.
- **Student Satisfaction Analytics**: 5-star distribution breakdown and review feedback.
- **Data Export**: One-click **Export to CSV** for university auditing and reporting.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Recharts, Lucide React, Vanilla CSS3 Design System |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Multer, Helmet, Morgan, CORS, Express-Rate-Limit |
| **Database** | MongoDB (`college_complaint_db`), Mongoose ODM |
| **Security** | Role-Based Access Control (RBAC), Password Hashing, Input Sanitization, Protected Routes |

---

## 📂 Project Folder Structure

```
college/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/            # CategoryPieChart, StatusBarChart, MonthlyLineChart, PriorityBarChart
│   │   │   ├── common/            # Navbar, Sidebar, Header, StatusBadge, PriorityBadge, Timeline, Modal, Toast, Pagination
│   │   │   └── complaints/        # AssignStaffModal, ChangeStatusModal, AddResponseSection, FeedbackModal
│   │   ├── context/               # AuthContext, ToastContext, NotificationContext
│   │   ├── layouts/               # PublicLayout, DashboardLayout
│   │   ├── pages/
│   │   │   ├── public/            # LandingPage, LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage
│   │   │   ├── student/           # StudentDashboard, SubmitComplaint, MyComplaints, TrackComplaint, StudentProfile
│   │   │   ├── staff/             # StaffDashboard, StaffComplaints, StaffComplaintDetails, StaffProfile
│   │   │   └── admin/             # AdminDashboard, AdminComplaints, AdminComplaintDetails, ManageStudents, ManageStaff, ManageCategories, FeedbackList, AdminAnalytics, AdminProfile
│   │   ├── services/              # Axios API clients (auth, complaints, admin, categories, feedback, dashboard, notifications)
│   │   ├── utils/                 # Formatters, Constants, Validators
│   │   ├── App.jsx                # Main Application & Protected Router Tree
│   │   ├── index.css              # Vanilla CSS Design System & Theme
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/                    # Database connection (db.js)
│   ├── controllers/               # Express route handlers
│   ├── middleware/                # JWT Auth, Multer upload, Error handler, Rate limit
│   ├── models/                    # Mongoose Models (User, Complaint, Category, Feedback, Notification, Counter)
│   ├── routes/                    # API Route definitions
│   ├── seeders/                   # Initial database seed script (seedData.js)
│   ├── uploads/                   # Uploaded images & PDF attachments
│   ├── utils/                     # Complaint ID generator, JWT signer
│   ├── server.js                  # Express App entry point
│   └── package.json
│
├── .env.example
├── .gitignore
├── package.json                   # Root orchestrator (concurrently runner)
└── README.md
```

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `server/` directory (or copy from `server/.env.example`):

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/college_complaint_db?retryWrites=true&w=majority
# For Local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/college_complaint_db

# JWT Secret Key
JWT_SECRET=college_complaint_management_super_secure_jwt_secret_key_2026_!@#$

# Frontend Client URL
CLIENT_URL=http://localhost:5173
```

---

## ⚡ Installation & Setup Instructions

### 1. Clone or Open Workspace
Open a terminal in the root `college/` folder.

### 2. Install Dependencies
Run the install command for both backend and frontend:
```bash
# In root directory:
npm run install-all

# Or manually:
cd server && npm install
cd ../client && npm install
```

### 3. Seed Demo Data (Admin, Faculty, Students & Sample Complaints)
To populate the database with 1 Admin, 2 Staff members, 5 Students, 15 Categories, and realistic sample complaints:
```bash
# From root directory:
npm run seed

# Or inside server directory:
cd server
npm run seed
```

### 4. Run the Full-Stack Application
Start both Express backend (Port `5000`) and Vite frontend (Port `5173`) simultaneously:
```bash
npm run dev
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🔑 Demo Login Credentials

You can log in directly using the following credentials or use the **Quick Demo Fill** buttons on the login page:

| Role | Email | Password | Description |
|---|---|---|---|
| 🛡️ **Administrator** | `admin@college.com` | `Admin@123` | Full access to complaints, analytics, staff assignment, categories, and students |
| 👨‍🏫 **Faculty/Staff 1** | `prof.sharma@college.com` | `Staff@123` | Infrastructure & Facilities In-Charge |
| 👨‍🏫 **Faculty/Staff 2** | `prof.patel@college.com` | `Staff@123` | Academic & Examination In-Charge |
| 👨‍🎓 **Student 1** | `rahul.verma@college.com` | `Student@123` | 3rd Year CSE (ID: `CS-2023-042`) |
| 👨‍🎓 **Student 2** | `priya.sharma@college.com` | `Student@123` | 2nd Year IT (ID: `IT-2024-018`) |

---

## 📡 REST API Documentation

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new student
- `POST /api/auth/login` — Login (Student, Staff, Admin)
- `GET /api/auth/me` — Get current logged-in user profile
- `PUT /api/auth/profile` — Update user profile
- `PUT /api/auth/change-password` — Change user password
- `POST /api/auth/forgot-password` — Generate reset link
- `POST /api/auth/reset-password/:token` — Reset password with token

### 📝 Complaints (`/api/complaints`)
- `POST /api/complaints` — Submit a complaint with attachments (Student)
- `GET /api/complaints` — Get complaints with search, filters & pagination
- `GET /api/complaints/:id` — Get single complaint details with timeline & responses
- `PUT /api/complaints/:id` — Update complaint (Student, if Pending)
- `DELETE /api/complaints/:id` — Delete complaint (Admin or Student if Pending)
- `PUT /api/complaints/:id/status` — Update status (*Under Review*, *In Progress*, *Resolved*, *Rejected*)
- `PUT /api/complaints/:id/assign` — Assign complaint to staff member (Admin)
- `POST /api/complaints/:id/response` — Post official/student reply on ticket
- `POST /api/complaints/:id/reopen` — Reopen a resolved/rejected ticket

### 👥 User Management (`/api/users`)
- `GET /api/users` — List users with search and role filters (Admin)
- `GET /api/users/staff/workload` — List staff with assigned ticket counts (Admin)
- `POST /api/users` — Create staff/student account (Admin)
- `PUT /api/users/:id` — Update user details (Admin)
- `DELETE /api/users/:id` — Delete user account (Admin)

### 🏷️ Categories (`/api/categories`)
- `GET /api/categories` — List active categories with complaint counts
- `POST /api/categories` — Create category (Admin)
- `PUT /api/categories/:id` — Update category (Admin)
- `DELETE /api/categories/:id` — Delete category (Admin)

### ⭐ Feedback (`/api/feedback`)
- `POST /api/feedback` — Submit 1–5 star rating for resolved complaint (Student)
- `GET /api/feedback` — Get feedback list and average ratings (Admin)

### 📊 Dashboard & Analytics (`/api/dashboard`)
- `GET /api/dashboard/admin` — Institutional metrics & Recharts datasets
- `GET /api/dashboard/student` — Student's personal grievance metrics
- `GET /api/dashboard/staff` — Staff member's assigned queue metrics

### 🔔 Notifications (`/api/notifications`)
- `GET /api/notifications` — Get user notifications & unread count
- `PUT /api/notifications/:id/read` — Mark notification read
- `PUT /api/notifications/read-all` — Mark all notifications read

---

## 🧪 Verification & Final Testing

All major user flows have been implemented and verified:
1. **Student Journey**: Register → Sign In → Submit grievance with evidence → Live timeline tracking → Official replies → 5-Star feedback submission.
2. **Staff Journey**: Sign In → View assigned queue → Inspect issue & student details → Update progress notes → Mark ticket as Resolved.
3. **Admin Journey**: Sign In → View multi-chart dashboard → Filter complaints → Delegate to faculty → Manage categories → Export CSV report.

---

## 📄 License
This project is licensed under the MIT License — suitable for university academic demonstration.
