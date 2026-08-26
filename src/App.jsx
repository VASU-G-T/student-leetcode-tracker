import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import BottomNav from './components/common/BottomNav';
import Toast from './components/common/Toast';

// Public & Student Pages
import PublicDashboard from './pages/PublicDashboard';
import StudentDirectory from './pages/StudentDirectory';
import StudentProfile from './pages/StudentProfile';
import PublicLeaderboard from './pages/PublicLeaderboard';
import PublicAnalytics from './pages/PublicAnalytics';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentEditProfile from './pages/student/StudentEditProfile';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminAddStudent from './pages/admin/AdminAddStudent';
import AdminEditStudent from './pages/admin/AdminEditStudent';
import AdminSync from './pages/admin/AdminSync';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

import { useAuth } from './context/AuthContext';

/**
 * Protected Route Wrapper for Admin routes
 */
function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      {/* Toast Notification Container */}
      <Toast />

      {/* Top Navbar */}
      <Navbar onMobileMenuToggle={() => setMobileMenuOpen(prev => !prev)} />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Responsive Desktop Sidebar */}
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full overflow-x-hidden">
          <Routes>
            {/* Public & Student Routes */}
            <Route path="/" element={<PublicDashboard />} />
            <Route path="/dashboard" element={<PublicDashboard />} />
            <Route path="/students" element={<StudentDirectory />} />
            <Route path="/student/:id" element={<StudentProfile />} />
            <Route path="/student/edit-profile" element={<StudentEditProfile />} />
            <Route path="/student/edit/:id" element={<StudentEditProfile />} />
            <Route path="/leaderboard" element={<PublicLeaderboard />} />
            <Route path="/analytics" element={<PublicAnalytics />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute><AdminStudents /></ProtectedRoute>} />
            <Route path="/admin/students/add" element={<ProtectedRoute><AdminAddStudent /></ProtectedRoute>} />
            <Route path="/admin/students/edit/:id" element={<ProtectedRoute><AdminEditStudent /></ProtectedRoute>} />
            <Route path="/admin/sync" element={<ProtectedRoute><AdminSync /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
