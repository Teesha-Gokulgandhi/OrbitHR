import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, MapPin } from 'lucide-react';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentTime] = useState(new Date().toLocaleTimeString());

  const handleCheckIn = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          location: 'Office'
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/employee/attendance'), 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to check in');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/attendance/check-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/employee/attendance'), 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to check out');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/employee/attendance')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Attendance</span>
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
          <p className="text-gray-600">Current Time: {currentTime}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-green-800">Attendance marked successfully!</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={handleCheckIn}
              disabled={loading || success}
              className="flex flex-col items-center p-8 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Check In</h3>
              <p className="text-gray-600 text-center">Mark your arrival for today</p>
            </button>

            <button
              onClick={handleCheckOut}
              disabled={loading || success}
              className="flex flex-col items-center p-8 border-2 border-red-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Check Out</h3>
              <p className="text-gray-600 text-center">Mark your departure for today</p>
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">Office - Main Building</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;