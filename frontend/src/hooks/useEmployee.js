import { useState, useEffect } from 'react';
import { employeeService } from '@services/api/employeeService';
import toast from 'react-hot-toast';

export const useEmployee = (employeeId = null) => {
  const [employee, setEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployee = async (id) => {
    setLoading(true);
    try {
      const data = await employeeService.getById(id);
      setEmployee(data);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch employee');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProfile = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getMyProfile();
      setEmployee(data);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async (params) => {
    setLoading(true);
    try {
      const data = await employeeService.getAll(params);
      setEmployees(data);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id, data) => {
    setLoading(true);
    try {
      const updated = await employeeService.update(id, data);
      toast.success('Employee updated successfully');
      return updated;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update employee');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchEmployee(employeeId);
    }
  }, [employeeId]);

  return {
    employee,
    employees,
    loading,
    error,
    fetchEmployee,
    fetchMyProfile,
    fetchEmployees,
    updateEmployee,
  };
};