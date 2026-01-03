import { useState } from 'react';
import { leaveService } from '@services/api/leaveService';
import toast from 'react-hot-toast';

export const useLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createLeave = async (data) => {
    setLoading(true);
    try {
      const result = await leaveService.create(data);
      toast.success('Leave request submitted successfully');
      return result;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to submit leave request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLeaves = async (params) => {
    setLoading(true);
    try {
      const data = await leaveService.getMyLeaves(params);
      setLeaves(data);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getBalance();
      setBalance(data);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch leave balance');
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async (id, comments) => {
    setLoading(true);
    try {
      const result = await leaveService.approve(id, comments);
      toast.success('Leave approved successfully');
      return result;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to approve leave');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectLeave = async (id, comments) => {
    setLoading(true);
    try {
      const result = await leaveService.reject(id, comments);
      toast.success('Leave rejected');
      return result;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to reject leave');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelLeave = async (id) => {
    setLoading(true);
    try {
      const result = await leaveService.cancel(id);
      toast.success('Leave cancelled successfully');
      return result;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to cancel leave');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    leaves,
    balance,
    loading,
    error,
    createLeave,
    fetchMyLeaves,
    fetchBalance,
    approveLeave,
    rejectLeave,
    cancelLeave,
  };
};