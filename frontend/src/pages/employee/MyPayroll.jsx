import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

const MyPayroll = () => {
  const navigate = useNavigate();
  const [payroll, setPayroll] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      const response = await fetch('/api/payroll/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setPayroll(data.current);
      setPayslips(data.history || []);
    } catch (err) {
      console.error('Error fetching payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPayslip = async (payrollId) => {
    try {
      const response = await fetch(`/api/payroll/${payrollId}/payslip`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip-${payrollId}.pdf`;
      a.click();
    } catch (err) {
      console.error('Error downloading payslip:', err);
    }
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
          <button
            onClick={() => navigate('/employee/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Payroll</h1>
          <p className="text-gray-600">View your salary details and payslips</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-100 mb-2">Current Month Salary</p>
              <h2 className="text-4xl font-bold">${payroll?.netSalary || 0}</h2>
              <p className="text-blue-100 mt-2">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <DollarSign className="w-10 h-10" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-blue-400">
            <div>
              <p className="text-blue-100 text-sm mb-1">Basic Salary</p>
              <p className="text-xl font-semibold">${payroll?.basicSalary || 0}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Allowances</p>
              <p className="text-xl font-semibold">${payroll?.allowances || 0}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Deductions</p>
              <p className="text-xl font-semibold">-${payroll?.deductions || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Basic Salary</span>
                </div>
                <span className="font-semibold text-gray-900">${payroll?.basicSalary || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Housing Allowance</span>
                </div>
                <span className="font-semibold text-gray-900">${payroll?.housingAllowance || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Transport Allowance</span>
                </div>
                <span className="font-semibold text-gray-900">${payroll?.transportAllowance || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <div className="flex items-center space-x-3">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700">Tax Deduction</span>
                </div>
                <span className="font-semibold text-red-600">-${payroll?.taxDeduction || 0}</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-gray-900 font-semibold">Net Salary</span>
                <span className="text-xl font-bold text-green-600">${payroll?.netSalary || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                <p className="font-semibold text-gray-900">{payroll?.paymentMethod || 'Bank Transfer'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Bank Account</p>
                <p className="font-semibold text-gray-900">{payroll?.bankAccount || '****1234'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Date</p>
                <p className="font-semibold text-gray-900">
                  {payroll?.paymentDate ? new Date(payroll.paymentDate).toLocaleDateString() : 'End of month'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  payroll?.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {payroll?.status || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Payslip History</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {payslips.length > 0 ? (
                payslips.map((slip, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {new Date(slip.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h4>
                        <p className="text-sm text-gray-600">Net Salary: ${slip.netSalary}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadPayslip(slip.id)}
                      className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No payslip history available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPayroll;