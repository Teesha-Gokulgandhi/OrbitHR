import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Search, Edit, Download, Plus, LogOut } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';

const PayrollManagement = () => {
  const { logout } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchPayrolls();
  }, [selectedMonth]);

  const fetchPayrolls = async () => {
    try {
      const response = await fetch('/api/payroll', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setPayrolls(data);
    } catch (err) {
      console.error('Error fetching payrolls:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePayslip = async (payrollId) => {
    try {
      const response = await fetch(`/api/payroll/${payrollId}/payslip`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip-${payrollId}.pdf`;
      a.click();
    } catch (err) {
      console.error('Error generating payslip:', err);
    }
  };

  const filteredPayrolls = payrolls.filter(p =>
    p.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPayroll = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);

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
                <Link to="/admin/leaves" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Leaves</Link>
                <Link to="/admin/payroll" className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg">Payroll</Link>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payroll Management</h1>
            <p className="text-gray-600">Manage employee salaries and payslips</p>
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-5 h-5" />
            <span>Process Payroll</span>
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-2">Total Monthly Payroll</p>
              <h2 className="text-5xl font-bold">${totalPayroll.toLocaleString()}</h2>
              <p className="text-green-100 mt-2">{payrolls.length} employees</p>
            </div>
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <DollarSign className="w-12 h-12" />
            </div>
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
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Basic Salary</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Allowances</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Deductions</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Net Salary</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayrolls.length > 0 ? (
                  filteredPayrolls.map((payroll, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {payroll.employeeName?.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">{payroll.employeeName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{payroll.employeeId}</td>
                      <td className="py-4 px-6 text-gray-900">${payroll.basicSalary}</td>
                      <td className="py-4 px-6 text-green-600">${payroll.allowances}</td>
                      <td className="py-4 px-6 text-red-600">-${payroll.deductions}</td>
                      <td className="py-4 px-6 text-gray-900 font-bold">${payroll.netSalary}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          payroll.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payroll.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => generatePayslip(payroll.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12">
                      <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No payroll records found</p>
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

export default PayrollManagement;