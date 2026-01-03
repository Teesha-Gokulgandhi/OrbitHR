// ============================================
// ADMIN PAGES
// ============================================

// pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Clock, DollarSign, TrendingUp, LogOut, AlertCircle } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/overview', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { icon: <Users className="w-6 h-6" />, title: 'Employees', path: '/admin/employees', color: 'blue', count: stats?.totalEmployees || 0 },
    { icon: <Clock className="w-6 h-6" />, title: 'Attendance', path: '/admin/attendance', color: 'green', count: stats?.todayPresent || 0 },
    { icon: <Calendar className="w-6 h-6" />, title: 'Leave Requests', path: '/admin/leaves', color: 'purple', count: stats?.pendingLeaves || 0 },
    { icon: <DollarSign className="w-6 h-6" />, title: 'Payroll', path: '/admin/payroll', color: 'yellow', count: stats?.monthlyPayroll || 0 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">Dayflow Admin</span>
              </div>
              <div className="hidden md:flex space-x-1">
                <Link to="/admin/dashboard" className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg">Dashboard</Link>
                <Link to="/admin/employees" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Employees</Link>
                <Link to="/admin/attendance" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Attendance</Link>
                <Link to="/admin/leaves" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Leaves</Link>
                <Link to="/admin/payroll" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Payroll</Link>
                <Link to="/admin/reports" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Reports</Link>
                <Link to="/admin/settings" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Settings</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin: {user?.firstName}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your organization's HR metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${link.color}-100 rounded-lg flex items-center justify-center text-${link.color}-600 group-hover:bg-${link.color}-600 group-hover:text-white transition`}>
                  {link.icon}
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{link.count}</h3>
              <p className="text-gray-600">{link.title}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Present</span>
                <span className="text-xl font-bold text-green-600">{stats?.attendance?.present || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">Absent</span>
                <span className="text-xl font-bold text-red-600">{stats?.attendance?.absent || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-gray-700">On Leave</span>
                <span className="text-xl font-bold text-yellow-600">{stats?.attendance?.leave || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
            <div className="space-y-3">
              {stats?.departments?.map((dept, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{dept.name}</span>
                  <span className="font-semibold text-gray-900">{dept.employeeCount} employees</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <Link to="/admin/reports" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {stats?.recentActivities?.map((activity, idx) => (
                <div key={idx} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'leave' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'attendance' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'leave' ? <Calendar className="w-5 h-5" /> :
                     activity.type === 'attendance' ? <Clock className="w-5 h-5" /> :
                     <Users className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
            <div className="space-y-3">
              <Link to="/admin/leaves" className="block p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-900 font-medium">Leave Approvals</span>
                  </div>
                  <span className="text-yellow-600 font-bold">{stats?.pendingLeaves || 0}</span>
                </div>
              </Link>
              <Link to="/admin/attendance" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900 font-medium">Attendance Review</span>
                  </div>
                  <span className="text-blue-600 font-bold">{stats?.pendingAttendance || 0}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;