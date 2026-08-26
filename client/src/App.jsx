import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import MyComplaints from './pages/student/MyComplaints';
import TrackComplaint from './pages/student/TrackComplaint';
import StudentProfile from './pages/student/StudentProfile';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffComplaints from './pages/staff/StaffComplaints';
import StaffComplaintDetails from './pages/staff/StaffComplaintDetails';
import StaffProfile from './pages/staff/StaffProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminComplaintDetails from './pages/admin/AdminComplaintDetails';
import ManageStudents from './pages/admin/ManageStudents';
import ManageStaff from './pages/admin/ManageStaff';
import ManageCategories from './pages/admin/ManageCategories';
import FeedbackList from './pages/admin/FeedbackList';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              </Route>

              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route
                  path="/student"
                  element={<DashboardLayout title="Student Grievance Portal" subtitle="Submit & track issues" />}
                >
                  <Route index element={<Navigate to="/student/dashboard" replace />} />
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="submit" element={<SubmitComplaint />} />
                  <Route path="complaints" element={<MyComplaints />} />
                  <Route path="track/:id" element={<TrackComplaint />} />
                  <Route path="profile" element={<StudentProfile />} />
                </Route>
              </Route>

              {/* Staff Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
                <Route
                  path="/staff"
                  element={<DashboardLayout title="Department Staff Portal" subtitle="Resolve assigned grievances" />}
                >
                  <Route index element={<Navigate to="/staff/dashboard" replace />} />
                  <Route path="dashboard" element={<StaffDashboard />} />
                  <Route path="complaints" element={<StaffComplaints />} />
                  <Route path="complaints/:id" element={<StaffComplaintDetails />} />
                  <Route path="profile" element={<StaffProfile />} />
                </Route>
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route
                  path="/admin"
                  element={<DashboardLayout title="College Admin Portal" subtitle="Institutional grievance management" />}
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="complaints" element={<AdminComplaints />} />
                  <Route path="complaints/:id" element={<AdminComplaintDetails />} />
                  <Route path="students" element={<ManageStudents />} />
                  <Route path="staff" element={<ManageStaff />} />
                  <Route path="categories" element={<ManageCategories />} />
                  <Route path="feedback" element={<FeedbackList />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Route>
              </Route>

              {/* 404 Catch-All */}
              <Route element={<PublicLayout />}>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
