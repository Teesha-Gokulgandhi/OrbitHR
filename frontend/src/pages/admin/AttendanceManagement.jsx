import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Search, Calendar, CheckCircle, XCircle, LogOut, Download } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';

const AttendanceManagement = () => {
  const { logout } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    try {
      const response = await fetch('/api/attendance/report', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setAttendance(data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleMarkAttendance = async (userId, status) => {
    try {
      await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          date: selectedDate,
          status
        })
      });
      fetchAttendance();
    } catch (err) {
      console.error('Error marking attendance:', err);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      'half-day': 'bg-yellow-100 text-yellow-800',
      leave: 'bg-blue-100 text-blue-800'
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const stats = {
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    leave: attendance.filter(a => a.status === 'leave').length,
    total: employees.length
  };

  const filteredAttendance = attendance.filter(a =>
    a.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Link to="/admin/attendance" className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg">Attendance</Link>
                <Link to="/admin/leaves" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Leaves</Link>
                <Link to="/admin/payroll" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Payroll</Link>
              </div>
            </div>
            <button onClick={logout} className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Management</h1>
            <p className="text-gray-600">Track and manage employee attendance</p>
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Employees</span>
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Present</span>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.present}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Absent</span>
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">On Leave</span>
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.leave}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6 border-b">
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Employee</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">ID</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Check In</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Check Out</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Hours</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {record.employeeName?.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">{record.employeeName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{record.employeeId}</td>
                      <td className="py-4 px-6 text-gray-900">{record.checkIn || '--:--'}</td>
                      <td className="py-4 px-6 text-gray-900">{record.checkOut || '--:--'}</td>
                      <td className="py-4 px-6 text-gray-900">{record.hours || '0'}h</td>
                      <td className="py-4 px-6">
                        <span className={getStatusBadge(record.status)}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={record.status}
                          onChange={(e) => handleMarkAttendance(record.userId, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="half-day">Half Day</option>
                          <option value="leave">Leave</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No attendance records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;