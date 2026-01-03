const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const Payroll = require('../models/Payroll');
const Department = require('../models/Department');

/**
 * @desc    Get system overview
 * @route   GET /api/dashboard/overview
 * @access  HR, ADMIN
 */
const getOverview = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            totalEmployees,
            totalDepartments,
            todayAttendance,
            pendingLeaves,
            activeEmployees,
            recentHires
        ] = await Promise.all([
            User.countDocuments(),
            Department.countDocuments({ status: 'ACTIVE' }),
            Attendance.countDocuments({
                date: today,
                status: 'PRESENT'
            }),
            LeaveRequest.countDocuments({ status: 'PENDING' }),
            User.countDocuments({ role: 'EMPLOYEE' }),
            EmployeeProfile.find()
                .populate('user_id', 'employee_id email')
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        res.json({
            success: true,
            data: {
                totalEmployees,
                totalDepartments,
                todayAttendance,
                pendingLeaves,
                activeEmployees,
                recentHires
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get employee statistics
 * @route   GET /api/dashboard/employees
 * @access  HR, ADMIN
 */
const getEmployeeStats = async (req, res, next) => {
    try {
        const [roleDistribution, departmentDistribution] = await Promise.all([
            User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            EmployeeProfile.aggregate([
                {
                    $group: {
                        _id: '$department',
                        count: { $sum: 1 }
                    }
                },
                { $match: { _id: { $ne: null } } },
                { $sort: { count: -1 } }
            ])
        ]);

        res.json({
            success: true,
            data: {
                roleDistribution,
                departmentDistribution
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get attendance statistics
 * @route   GET /api/dashboard/attendance
 * @access  HR, ADMIN
 */
const getAttendanceStats = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dateQuery = startDate && endDate
            ? {
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
            : { date: today };

        const [statusBreakdown, avgHours, totalRecords] = await Promise.all([
            Attendance.aggregate([
                { $match: dateQuery },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]),
            Attendance.aggregate([
                { $match: { ...dateQuery, total_hours: { $exists: true } } },
                {
                    $group: {
                        _id: null,
                        avgHours: { $avg: '$total_hours' }
                    }
                }
            ]),
            Attendance.countDocuments(dateQuery)
        ]);

        res.json({
            success: true,
            data: {
                statusBreakdown,
                averageHours: avgHours.length > 0 ? avgHours[0].avgHours : 0,
                totalRecords
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get leave statistics
 * @route   GET /api/dashboard/leaves
 * @access  HR, ADMIN
 */
const getLeaveStats = async (req, res, next) => {
    try {
        const [statusBreakdown, typeBreakdown, recentRequests] = await Promise.all([
            LeaveRequest.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalDays: { $sum: '$total_days' }
                    }
                }
            ]),
            LeaveRequest.aggregate([
                {
                    $group: {
                        _id: '$leave_type',
                        count: { $sum: 1 },
                        totalDays: { $sum: '$total_days' }
                    }
                }
            ]),
            LeaveRequest.find()
                .populate('user_id', 'employee_id email')
                .sort({ createdAt: -1 })
                .limit(10)
        ]);

        res.json({
            success: true,
            data: {
                statusBreakdown,
                typeBreakdown,
                recentRequests
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get personal dashboard
 * @route   GET /api/dashboard/me
 * @access  Private
 */
const getMyDashboard = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);

        const [
            profile,
            todayAttendance,
            monthAttendance,
            pendingLeaves,
            approvedLeaves,
            payroll
        ] = await Promise.all([
            EmployeeProfile.findOne({ user_id: req.user.id })
                .populate('user_id', 'employee_id email role'),
            Attendance.findOne({
                user_id: req.user.id,
                date: today
            }),
            Attendance.countDocuments({
                user_id: req.user.id,
                date: { $gte: currentMonth },
                status: 'PRESENT'
            }),
            LeaveRequest.countDocuments({
                user_id: req.user.id,
                status: 'PENDING'
            }),
            LeaveRequest.find({
                user_id: req.user.id,
                status: 'APPROVED'
            }).limit(5),
            Payroll.findOne({ user_id: req.user.id })
        ]);

        res.json({
            success: true,
            data: {
                profile,
                attendance: {
                    today: todayAttendance,
                    monthCount: monthAttendance
                },
                leaves: {
                    pendingCount: pendingLeaves,
                    recentApproved: approvedLeaves
                },
                payroll: payroll ? {
                    gross_salary: payroll.gross_salary,
                    net_salary: payroll.net_salary
                } : null
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getOverview,
    getEmployeeStats,
    getAttendanceStats,
    getLeaveStats,
    getMyDashboard
};
