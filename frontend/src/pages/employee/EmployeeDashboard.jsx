import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, Clock, DollarSign, FileText, LogOut, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: <User className="w-6 h-6" />, title: 'My Profile', path: '/employee/profile', color: 'blue' },
    { icon: <Clock className="w-6 h-6" />, title: 'Attendance', path: '/employee/attendance', color: 'green' },
    { icon: <Calendar className="w-6 h-6" />, title: 'Leave Requests', path: '/employee/leaves', color: 'purple' },
    { icon: <DollarSign className="w-6 h-6" />, title: 'Payroll', path: '/employee/payroll', color: 'yellow' }
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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Dayflow</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.firstName || 'Employee'}</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Dashboard</h1>
          <p className="text-gray-600">Manage your work activities and information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.path}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group"
            >
              <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-4 text-${action.color}-600 group-hover:bg-${action.color}-600 group-hover:text-white transition`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Attendance Today</h3>
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-green-600">
                  {dashboardData?.attendance?.status || 'Not Checked In'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check In:</span>
                <span className="font-semibold">
                  {dashboardData?.attendance?.checkIn || '--:--'}
                </span>
              </div>
              <Link
                to="/employee/attendance/mark"
                className="block mt-4 text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Mark Attendance
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Leave Balance</h3>
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-semibold text-purple-600">
                  {dashboardData?.leaveBalance?.available || 0} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Used:</span>
                <span className="font-semibold">
                  {dashboardData?.leaveBalance?.used || 0} days
                </span>
              </div>
              <Link
                to="/employee/leaves"
                className="block mt-4 text-center py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Apply Leave
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Salary:</span>
                <span className="font-semibold text-yellow-600">
                  ${dashboardData?.salary?.amount || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold">
                  {dashboardData?.salary?.status || 'Pending'}
                </span>
              </div>
              <Link
                to="/employee/payroll"
                className="block mt-4 text-center py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
              >
                View Payroll
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {dashboardData?.recentActivities?.length > 0 ? (
              dashboardData.recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'approved' ? 'bg-green-100 text-green-600' :
                    activity.type === 'rejected' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'approved' ? <CheckCircle className="w-5 h-5" /> :
                     activity.type === 'rejected' ? <XCircle className="w-5 h-5" /> :
                     <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;