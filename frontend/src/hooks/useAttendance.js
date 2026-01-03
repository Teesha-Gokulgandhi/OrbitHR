import { useState } from 'react';
import { attendanceService } from '@services/api/attendanceService';
import toast from 'react-hot-toast';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkIn = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.checkIn();
      toast.success('Checked in successfully');
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to check in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.checkOut();
      toast.success('Checked out successfully');
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to check out');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyAttendance = async (params) => {
    setLoading(true);
    try {
      const data = await attendanceService.getMyAttendance(params);
      setAttendance(data);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (data) => {
    setLoading(true);
    try {
      const result = await attendanceService.markAttendance(data);
      toast.success('Attendance marked successfully');
      return result;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to mark attendance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    attendance,
    loading,
    error,
    checkIn,
    checkOut,
    fetchMyAttendance,
    markAttendance,
  };
};