import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Download, Calendar, Users, Clock, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';

const ReportsAnalytics = () => {
  const { logout } = useAuth();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/dashboard/overview', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    { title: 'Attendance Report', icon: <Clock className="w-6 h-6" />, color: 'green', description: 'Monthly attendance summary' },
    { title: 'Leave Report', icon: <Calendar className="w-6 h-6" />, color: 'purple', description: 'Leave requests and approvals' },
    { title: 'Payroll Report', icon: <DollarSign className="w-6 h-6" />, color: 'yellow', description: 'Salary disbursements' },
    { title: 'Employee Report', icon: <Users className="w-6 h-6" />, color: 'blue', description: 'Employee statistics' }
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
              <Link to="/admin/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">Dayflow Admin</span>
              </Link>
              <div className="hidden md:flex space-x-1">
                <Link to="/admin/dashboard" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                <Link to="/admin/employees" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Employees</Link>
                <Link to="/admin/reports" className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg">Reports</Link>
              </div>
            </div>
            <button onClick={logout} className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and view comprehensive HR reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reportTypes.map((report, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
              <div className={`w-12 h-12 bg-${report.color}-100 rounded-lg flex items-center justify-center mb-4 text-${report.color}-600`}>
                {report.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Attendance Trends</h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Present</span>
                </div>
                <span className="text-xl font-bold text-green-600">85%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-gray-700">Absent</span>
                </div>
                <span className="text-xl font-bold text-red-600">5%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">On Leave</span>
                </div>
                <span className="text-xl font-bold text-blue-600">10%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Statistics</h3>
            <div className="space-y-4">
              {reports?.departments?.map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{dept.name}</p>
                    <p className="text-sm text-gray-600">{dept.employeeCount} employees</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-semibold">+{dept.growth}%</span>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-8">No department data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;