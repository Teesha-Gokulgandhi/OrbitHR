import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, CheckCircle, XCircle, Clock, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';

const LeaveApprovals = () => {
  const { logout } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const fetchLeaves = async () => {
    try {
      const response = await fetch('/api/leaves', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setLeaves(data);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      await fetch(`/api/leaves/${leaveId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ comment })
      });
      setSelectedLeave(null);
      setComment('');
      fetchLeaves();
    } catch (err) {
      console.error('Error approving leave:', err);
    }
  };

  const handleReject = async (leaveId) => {
    try {
      await fetch(`/api/leaves/${leaveId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ comment })
      });
      setSelectedLeave(null);
      setComment('');
      fetchLeaves();
    } catch (err) {
      console.error('Error rejecting leave:', err);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const filteredLeaves = leaves
    .filter(l => filter === 'all' || l.status === filter)
    .filter(l =>
      l.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length
  };

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
                <Link to="/admin/attendance" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Attendance</Link>
                <Link to="/admin/leaves" className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg">Leaves</Link>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leave Approvals</h1>
          <p className="text-gray-600">Review and manage employee leave requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Pending</span>
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Approved</span>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Rejected</span>
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6 border-b">
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by employee name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg transition ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('approved')}
                  className={`px-4 py-2 rounded-lg transition ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setFilter('rejected')}
                  className={`px-4 py-2 rounded-lg transition ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredLeaves.length > 0 ? (
            filteredLeaves.map((leave, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {leave.employeeName?.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{leave.employeeName}</h3>
                        <p className="text-sm text-gray-600">{leave.employeeId} • {leave.department}</p>
                      </div>
                      <span className={getStatusBadge(leave.status)}>{leave.status}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Leave Type</p>
                        <p className="font-semibold text-gray-900">{leave.leaveType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">From</p>
                        <p className="font-semibold text-gray-900">{new Date(leave.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">To</p>
                        <p className="font-semibold text-gray-900">{new Date(leave.endDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold text-gray-900">{leave.days} days</p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Reason:</p>
                      <p className="text-gray-900">{leave.reason}</p>
                    </div>
                  </div>
                  {leave.status === 'pending' && (
                    <div className="flex space-x-2 ml-6">
                      <button
                        onClick={() => setSelectedLeave({ ...leave, action: 'approve' })}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => setSelectedLeave({ ...leave, action: 'reject' })}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No leave requests found</p>
            </div>
          )}
        </div>
      </div>

      {selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedLeave.action === 'approve' ? 'Approve' : 'Reject'} Leave Request
            </h2>
            <div className="mb-4">
              <p className="text-gray-600">Employee: <span className="font-semibold text-gray-900">{selectedLeave.employeeName}</span></p>
              <p className="text-gray-600">Duration: <span className="font-semibold text-gray-900">{selectedLeave.days} days</span></p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a comment..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedLeave(null);
                  setComment('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedLeave.action === 'approve' ? handleApprove(selectedLeave.id) : handleReject(selectedLeave.id)}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition ${
                  selectedLeave.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {selectedLeave.action === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApprovals;