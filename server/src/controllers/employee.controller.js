const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');

/**
 * @desc    Get all employees with pagination and filters
 * @route   GET /api/employees
 * @access  HR, ADMIN
 */
const getAllEmployees = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            department,
            designation,
            search
        } = req.query;

        const query = {};

        if (department) query.department = department;
        if (designation) query.designation = designation;
        if (search) {
            query.$or = [
                { first_name: { $regex: search, $options: 'i' } },
                { last_name: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const [employees, total] = await Promise.all([
            EmployeeProfile.find(query)
                .populate('user_id', 'employee_id email role is_email_verified')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 }),
            EmployeeProfile.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: employees,
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
 * @desc    Get employee by ID
 * @route   GET /api/employees/:id
 * @access  HR, ADMIN, Self
 */
const getEmployeeById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const employee = await EmployeeProfile.findOne({ user_id: id })
            .populate('user_id', 'employee_id email role is_email_verified createdAt');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Check if user is accessing their own profile or has HR/ADMIN role
        if (req.user.id !== id && !['HR', 'ADMIN'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: employee
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get authenticated user's profile
 * @route   GET /api/employees/me
 * @access  Private
 */
const getMyProfile = async (req, res, next) => {
    try {
        const employee = await EmployeeProfile.findOne({ user_id: req.user.id })
            .populate('user_id', 'employee_id email role is_email_verified createdAt');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.json({
            success: true,
            data: employee
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update own profile
 * @route   PUT /api/employees/me
 * @access  Private
 */
const updateMyProfile = async (req, res, next) => {
    try {
        const allowedUpdates = [
            'phone',
            'address',
            'emergency_contact_name',
            'emergency_contact_phone',
            'profile_picture'
        ];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const employee = await EmployeeProfile.findOneAndUpdate(
            { user_id: req.user.id },
            updates,
            { new: true, runValidators: true }
        ).populate('user_id', 'employee_id email role');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: employee
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update employee profile
 * @route   PUT /api/employees/:id
 * @access  HR, ADMIN
 */
const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;

        const employee = await EmployeeProfile.findOneAndUpdate(
            { user_id: id },
            req.body,
            { new: true, runValidators: true }
        ).populate('user_id', 'employee_id email role');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Notify user (logging only, no queue)
        console.log(`📝 Employee ${id} profile updated by HR/ADMIN`);

        res.json({
            success: true,
            message: 'Employee updated successfully',
            data: employee
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete employee (soft delete)
 * @route   DELETE /api/employees/:id
 * @access  ADMIN
 */
const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Delete associated profile
        await EmployeeProfile.findOneAndDelete({ user_id: id });

        res.json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get employee statistics
 * @route   GET /api/employees/stats
 * @access  HR, ADMIN
 */
const getEmployeeStats = async (req, res, next) => {
    try {
        const [
            totalEmployees,
            employeesByRole,
            employeesByDepartment,
            recentEmployees
        ] = await Promise.all([
            User.countDocuments(),
            User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } }
            ]),
            EmployeeProfile.aggregate([
                {
                    $group: {
                        _id: '$department',
                        count: { $sum: 1 }
                    }
                },
                { $match: { _id: { $ne: null } } }
            ]),
            EmployeeProfile.find()
                .populate('user_id', 'employee_id email')
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        res.json({
            success: true,
            data: {
                totalEmployees,
                byRole: employeesByRole,
                byDepartment: employeesByDepartment,
                recentEmployees
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    getMyProfile,
    updateMyProfile,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats
};
