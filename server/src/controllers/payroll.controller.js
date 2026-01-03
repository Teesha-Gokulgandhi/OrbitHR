const Payroll = require('../models/Payroll');

/**
 * @desc    Create payroll record
 * @route   POST /api/payroll
 * @access  HR, ADMIN
 */
const createPayroll = async (req, res, next) => {
    try {
        const {
            user_id,
            basic_salary,
            hra = 0,
            transport_allowance = 0,
            medical_allowance = 0,
            special_allowance = 0,
            pf_deduction = 0,
            tax_deduction = 0,
            other_deductions = 0,
            bank_name,
            account_number,
            ifsc_code
        } = req.body;

        // Calculate gross and net salary
        const gross_salary = basic_salary + hra + transport_allowance + medical_allowance + special_allowance;
        const total_deductions = pf_deduction + tax_deduction + other_deductions;
        const net_salary = gross_salary - total_deductions;

        const payroll = await Payroll.create({
            user_id,
            basic_salary,
            hra,
            transport_allowance,
            medical_allowance,
            special_allowance,
            gross_salary,
            pf_deduction,
            tax_deduction,
            other_deductions,
            net_salary,
            bank_name,
            account_number,
            ifsc_code
        });

        // Log notification (no queue)
        console.log(`💰 Payroll created for user ${user_id}`);

        res.status(201).json({
            success: true,
            message: 'Payroll created successfully',
            data: payroll
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update payroll
 * @route   PUT /api/payroll/:id
 * @access  HR, ADMIN
 */
const updatePayroll = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Recalculate if salary components changed
        if (req.body.basic_salary || req.body.hra || req.body.transport_allowance ||
            req.body.medical_allowance || req.body.special_allowance) {

            const payroll = await Payroll.findById(id);
            const basic = req.body.basic_salary || payroll.basic_salary;
            const hra = req.body.hra !== undefined ? req.body.hra : payroll.hra;
            const transport = req.body.transport_allowance !== undefined ? req.body.transport_allowance : payroll.transport_allowance;
            const medical = req.body.medical_allowance !== undefined ? req.body.medical_allowance : payroll.medical_allowance;
            const special = req.body.special_allowance !== undefined ? req.body.special_allowance : payroll.special_allowance;

            req.body.gross_salary = basic + hra + transport + medical + special;

            const pf = req.body.pf_deduction !== undefined ? req.body.pf_deduction : payroll.pf_deduction;
            const tax = req.body.tax_deduction !== undefined ? req.body.tax_deduction : payroll.tax_deduction;
            const other = req.body.other_deductions !== undefined ? req.body.other_deductions : payroll.other_deductions;

            req.body.net_salary = req.body.gross_salary - (pf + tax + other);
        }

        const payroll = await Payroll.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user_id', 'employee_id email');

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll not found'
            });
        }

        console.log(`💰 Payroll updated for user ${payroll.user_id._id}`);

        res.json({
            success: true,
            message: 'Payroll updated successfully',
            data: payroll
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get my payroll
 * @route   GET /api/payroll/me
 * @access  Private
 */
const getMyPayroll = async (req, res, next) => {
    try {
        const payroll = await Payroll.findOne({ user_id: req.user.id });

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll information not found'
            });
        }

        res.json({
            success: true,
            data: payroll
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get payroll by user ID
 * @route   GET /api/payroll/user/:userId
 * @access  HR, ADMIN
 */
const getPayrollByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const payroll = await Payroll.findOne({ user_id: userId })
            .populate('user_id', 'employee_id email');

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll not found'
            });
        }

        res.json({
            success: true,
            data: payroll
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all payrolls
 * @route   GET /api/payroll
 * @access  HR, ADMIN
 */
const getAllPayrolls = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const [payrolls, total] = await Promise.all([
            Payroll.find()
                .populate('user_id', 'employee_id email')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 }),
            Payroll.countDocuments()
        ]);

        res.json({
            success: true,
            data: payrolls,
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
 * @desc    Generate payslip
 * @route   POST /api/payroll/:id/payslip
 * @access  HR, ADMIN or Self
 */
const generatePayslip = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { month, year } = req.body;

        const payroll = await Payroll.findById(id)
            .populate('user_id', 'employee_id email');

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll not found'
            });
        }

        // Check authorization
        if (payroll.user_id._id.toString() !== req.user.id && !['HR', 'ADMIN'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Payslip generation not available (was queue-based)
        res.json({
            success: true,
            message: 'Payslip data retrieved. PDF generation is not available in this version.',
            data: {
                payroll,
                month,
                year
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete payroll
 * @route   DELETE /api/payroll/:id
 * @access  ADMIN
 */
const deletePayroll = async (req, res, next) => {
    try {
        const payroll = await Payroll.findByIdAndDelete(req.params.id);

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll not found'
            });
        }

        res.json({
            success: true,
            message: 'Payroll deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPayroll,
    updatePayroll,
    getMyPayroll,
    getPayrollByUserId,
    getAllPayrolls,
    generatePayslip,
    deletePayroll
};
