const LeaveRequest = require('../models/LeaveRequest');
const emailService = require('../services/email.service');
const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');
const Attendance = require('../models/Attendance');

/**
 * @desc    Create new leave request
 * @route   POST /api/leaves
 * @access  Private
 */
const createLeaveRequest = async (req, res, next) => {
    try {
        const { leave_type, start_date, end_date, reason } = req.body;

        // Calculate total days
        const start = new Date(start_date);
        const end = new Date(end_date);
        const total_days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (total_days <= 0) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        const leaveRequest = await LeaveRequest.create({
            user_id: req.user.id,
            leave_type,
            start_date,
            end_date,
            total_days,
            reason,
            status: 'PENDING'
        });

        console.log(`🏖️  Leave request created: ${leaveRequest._id} by user ${req.user.id}`);

        res.status(201).json({
            success: true,
            message: 'Leave request submitted successfully',
            data: leaveRequest
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get my leave requests
 * @route   GET /api/leaves/me
 * @access  Private
 */
const getMyLeaves = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { user_id: req.user.id };
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const [leaves, total] = await Promise.all([
            LeaveRequest.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            LeaveRequest.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: leaves,
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
 * @desc    Get all leave requests
 * @route   GET /api/leaves
 * @access  HR, ADMIN
 */
const getAllLeaves = async (req, res, next) => {
    try {
        const { status, leave_type, page = 1, limit = 10 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (leave_type) query.leave_type = leave_type;

        const skip = (page - 1) * limit;

        const [leaves, total] = await Promise.all([
            LeaveRequest.find(query)
                .populate('user_id', 'employee_id email')
                .populate('approved_by', 'employee_id email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            LeaveRequest.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: leaves,
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
 * @desc    Get leave request by ID
 * @route   GET /api/leaves/:id
 * @access  Private
 */
const getLeaveById = async (req, res, next) => {
    try {
        const leave = await LeaveRequest.findById(req.params.id)
            .populate('user_id', 'employee_id email')
            .populate('approved_by', 'employee_id email');

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        // Check if user can access this leave request
        if (leave.user_id._id.toString() !== req.user.id && !['HR', 'ADMIN'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: leave
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Approve leave request
 * @route   PUT /api/leaves/:id/approve
 * @access  HR, ADMIN
 */
const approveLeave = async (req, res, next) => {
    try {
        const { approval_comments } = req.body;

        const leave = await LeaveRequest.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        if (leave.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: 'Leave request has already been processed'
            });
        }

        leave.status = 'APPROVED';
        leave.approved_by = req.user.id;
        leave.approval_comments = approval_comments;
        leave.approved_at = new Date();
        await leave.save();

        // Send approval email synchronously
        try {
            const user = await User.findById(leave.user_id);
            const profile = await EmployeeProfile.findOne({ user_id: leave.user_id });

            await emailService.sendEmail({
                to: user.email,
                subject: 'Leave Request Approved',
                templateName: 'leave-approved',
                data: {
                    name: profile?.first_name || 'Employee',
                    start_date: leave.start_date.toLocaleDateString(),
                    end_date: leave.end_date.toLocaleDateString(),
                    comments: approval_comments || '',
                },
            });
            console.log(`📧 Leave approval email sent to ${user.email}`);
        } catch (emailError) {
            console.error('Failed to send leave approval email:', emailError.message);
            // Don't fail the request if email fails
        }

        // Update attendance records for approved leave
        try {
            const start = new Date(leave.start_date);
            const end = new Date(leave.end_date);

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                await Attendance.findOneAndUpdate(
                    { user_id: leave.user_id, date: new Date(d) },
                    {
                        status: 'LEAVE',
                        user_id: leave.user_id,
                        date: new Date(d),
                    },
                    { upsert: true, new: true }
                );
            }
            console.log(`📅 Attendance updated for leave from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`);
        } catch (attendanceError) {
            console.error('Failed to update attendance:', attendanceError.message);
        }

        res.json({
            success: true,
            message: 'Leave request approved',
            data: leave
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reject leave request
 * @route   PUT /api/leaves/:id/reject
 * @access  HR, ADMIN
 */
const rejectLeave = async (req, res, next) => {
    try {
        const { approval_comments } = req.body;

        const leave = await LeaveRequest.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        if (leave.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: 'Leave request has already been processed'
            });
        }

        leave.status = 'REJECTED';
        leave.approved_by = req.user.id;
        leave.approval_comments = approval_comments;
        leave.approved_at = new Date();
        await leave.save();

        // Send rejection email synchronously
        try {
            const user = await User.findById(leave.user_id);
            const profile = await EmployeeProfile.findOne({ user_id: leave.user_id });

            await emailService.sendEmail({
                to: user.email,
                subject: 'Leave Request Rejected',
                templateName: 'leave-rejected',
                data: {
                    name: profile?.first_name || 'Employee',
                    start_date: leave.start_date.toLocaleDateString(),
                    end_date: leave.end_date.toLocaleDateString(),
                    comments: approval_comments || 'Not specified',
                },
            });
            console.log(`📧 Leave rejection email sent to ${user.email}`);
        } catch (emailError) {
            console.error('Failed to send leave rejection email:', emailError.message);
        }

        res.json({
            success: true,
            message: 'Leave request rejected',
            data: leave
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Cancel leave request
 * @route   DELETE /api/leaves/:id
 * @access  Private
 */
const cancelLeave = async (req, res, next) => {
    try {
        const leave = await LeaveRequest.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        // Check ownership
        if (leave.user_id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this leave request'
            });
        }

        if (leave.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: 'Can only cancel pending leave requests'
            });
        }

        await leave.deleteOne();

        res.json({
            success: true,
            message: 'Leave request cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get leave balance
 * @route   GET /api/leaves/balance
 * @access  Private
 */
const getLeaveBalance = async (req, res, next) => {
    try {
        const currentYear = new Date().getFullYear();
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);

        const leaves = await LeaveRequest.find({
            user_id: req.user.id,
            status: 'APPROVED',
            start_date: { $gte: yearStart, $lte: yearEnd }
        });

        const balance = {
            PAID: { taken: 0, total: 20 },
            SICK: { taken: 0, total: 10 },
            UNPAID: { taken: 0, total: 0 }
        };

        leaves.forEach(leave => {
            balance[leave.leave_type].taken += leave.total_days;
        });

        balance.PAID.remaining = balance.PAID.total - balance.PAID.taken;
        balance.SICK.remaining = balance.SICK.total - balance.SICK.taken;

        res.json({
            success: true,
            data: balance
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLeaveRequest,
    getMyLeaves,
    getAllLeaves,
    getLeaveById,
    approveLeave,
    rejectLeave,
    cancelLeave,
    getLeaveBalance
};
