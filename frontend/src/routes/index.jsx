import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import LandingPage from '@pages/public/LandingPage';
import LoginPage from '@pages/public/LoginPage';
import SignupPage from '@pages/public/SignupPage';
import NotFoundPage from '@pages/public/NotFoundPage';

// Employee Pages
import EmployeeDashboard from '@pages/employee/EmployeeDashboard';
import EmployeeProfile from '@pages/employee/EmployeeProfile';
import MyAttendance from '@pages/employee/MyAttendance';
import MarkAttendance from '@pages/employee/MarkAttendance';
import MyLeaves from '@pages/employee/MyLeaves';
import MyPayroll from '@pages/employee/MyPayroll';

// Admin Pages
import AdminDashboard from '@pages/admin/AdminDashboard';
import EmployeeManagement from '@pages/admin/EmployeeManagement';
import AttendanceManagement from '@pages/admin/AttendanceManagement';
import LeaveApprovals from '@pages/admin/LeaveApprovals';
import PayrollManagement from '@pages/admin/PayrollManagement';
import ReportsAnalytics from '@pages/admin/ReportsAnalytics';
import Settings from '@pages/admin/Settings';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to={user?.role === 'employee' ? '/employee/dashboard' : '/admin/dashboard'} /> : <LandingPage />} />
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} />

      {/* Employee Routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <MyAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance/mark"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <MarkAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/leaves"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <MyLeaves />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/payroll"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <MyPayroll />
          </ProtectedRoute>
        }
      />

      {/* Admin/HR Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr']}>
            <EmployeeManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr']}>
            <AttendanceManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leaves"
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr']}>
            <LeaveApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payroll"
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr']}>
            <PayrollManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr']}>
            <ReportsAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;