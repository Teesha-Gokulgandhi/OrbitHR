const Attendance = require('../models/Attendance');

/**
 * @desc    Check in
 * @route   POST /api/attendance/check-in
 * @access  Private
 */
const checkIn = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already checked in today
        const existingAttendance = await Attendance.findOne({
            user_id: req.user.id,
            date: today
        });

        if (existingAttendance && existingAttendance.check_in) {
            return res.status(400).json({
                success: false,
                message: 'Already checked in today'
            });
        }

        const checkInTime = new Date().toTimeString().split(' ')[0]; // HH:MM:SS

        const attendance = await Attendance.findOneAndUpdate(
            { user_id: req.user.id, date: today },
            {
                check_in: checkInTime,
                status: 'PRESENT'
            },
            { new: true, upsert: true }
        );

        console.log(`⌚ Check-in recorded for user ${req.user.id} at ${checkInTime}`);

        res.json({
            success: true,
            message: 'Checked in successfully',
            data: attendance
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Check out
 * @route   POST /api/attendance/check-out
 * @access  Private
 */
const checkOut = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            user_id: req.user.id,
            date: today
        });

        if (!attendance || !attendance.check_in) {
            return res.status(400).json({
                success: false,
                message: 'Please check in first'
            });
        }

        if (attendance.check_out) {
            return res.status(400).json({
                success: false,
                message: 'Already checked out today'
            });
        }

        const checkOutTime = new Date().toTimeString().split(' ')[0];

        // Calculate total hours
        const checkIn = new Date(`1970-01-01T${attendance.check_in}`);
        const checkOut = new Date(`1970-01-01T${checkOutTime}`);
        const totalHours = (checkOut - checkIn) / (1000 * 60 * 60);

        attendance.check_out = checkOutTime;
        attendance.total_hours = Math.round(totalHours * 100) / 100;
        await attendance.save();

        console.log(`⌚ Check-out recorded for user ${req.user.id} at ${checkOutTime}. Total hours: ${attendance.total_hours}`);

        res.json({
            success: true,
            message: 'Checked out successfully',
            data: attendance
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get my attendance records
 * @route   GET /api/attendance/me
 * @access  Private
 */
const getMyAttendance = async (req, res, next) => {
    try {
        const { startDate, endDate, page = 1, limit = 10 } = req.query;

        const query = { user_id: req.user.id };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const [attendance, total] = await Promise.all([
            Attendance.find(query)
                .sort({ date: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Attendance.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: attendance,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get attendance for specific user
 * @route   GET /api/attendance/:userId
 * @access  HR, ADMIN
 */
const getAttendance = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate, page = 1, limit = 10 } = req.query;

        const query = { user_id: userId };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const [attendance, total] = await Promise.all([
            Attendance.find(query)
                .populate('user_id', 'employee_id email')
                .sort({ date: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Attendance.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: attendance,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Manually mark attendance
 * @route   POST /api/attendance/mark
 * @access  HR, ADMIN
 */
const markAttendance = async (req, res, next) => {
    try {
        const { user_id, date, check_in, check_out, status, remarks } = req.body;

        const attendanceData = {
            user_id,
            date: new Date(date),
            status,
            remarks
        };

        if (check_in) attendanceData.check_in = check_in;
        if (check_out) {
            attendanceData.check_out = check_out;

            // Calculate total hours
            if (check_in) {
                const checkInDate = new Date(`1970-01-01T${check_in}`);
                const checkOutDate = new Date(`1970-01-01T${check_out}`);
                const totalHours = (checkOutDate - checkInDate) / (1000 * 60 * 60);
                attendanceData.total_hours = Math.round(totalHours * 100) / 100;
            }
        }

        const attendance = await Attendance.findOneAndUpdate(
            { user_id, date: new Date(date) },
            attendanceData,
            { new: true, upsert: true, runValidators: true }
        );

        console.log(`📅 Attendance marked for user ${user_id} on ${date}`);

        res.json({
            success: true,
            message: 'Attendance marked successfully',
            data: attendance
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get attendance report
 * @route   GET /api/attendance/report
 * @access  HR, ADMIN
 */
const getAttendanceReport = async (req, res, next) => {
    try {
        const { startDate, endDate, status } = req.query;

        const matchQuery = {};

        if (startDate || endDate) {
            matchQuery.date = {};
            if (startDate) matchQuery.date.$gte = new Date(startDate);
            if (endDate) matchQuery.date.$lte = new Date(endDate);
        }

        if (status) matchQuery.status = status;

        const report = await Attendance.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    avgHours: { $avg: '$total_hours' }
                }
            }
        ]);

        const userStats = await Attendance.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$user_id',
                    totalDays: { $sum: 1 },
                    presentDays: {
                        $sum: { $cond: [{ $eq: ['$status', 'PRESENT'] }, 1, 0] }
                    },
                    avgHours: { $avg: '$total_hours' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    employee_id: '$user.employee_id',
                    email: '$user.email',
                    totalDays: 1,
                    presentDays: 1,
                    avgHours: { $round: ['$avgHours', 2] }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                statusSummary: report,
                userStats
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkIn,
    checkOut,
    getMyAttendance,
    getAttendance,
    markAttendance,
    getAttendanceReport
};
