import { Link } from 'react-router-dom';
import { Users, Calendar, FileText, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Employee Management",
      description: "Efficiently manage employee profiles, onboarding, and records in one place"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Attendance Tracking",
      description: "Real-time attendance monitoring with check-in/check-out capabilities"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Leave Management",
      description: "Streamlined leave application and approval workflows"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Payroll Management",
      description: "Comprehensive salary structure and payslip generation"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analytics & Reports",
      description: "Insightful dashboards and detailed reports for decision making"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Approval Workflows",
      description: "Automated approval processes for leaves and attendance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Dayflow</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition">
                Login
              </Link>
              <Link to="/signup" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Every workday,
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              perfectly aligned
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Streamline your HR operations with our comprehensive Human Resource Management System.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg">
              Get Started
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition font-semibold text-lg border-2 border-blue-600">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white rounded-3xl shadow-xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern HR</h2>
          <p className="text-lg text-gray-600">Everything you need to manage your workforce effectively</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 Dayflow HRMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;