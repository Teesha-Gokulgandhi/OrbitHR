const Department = require('../models/Department');
const EmployeeProfile = require('../models/EmployeeProfile');

/**
 * @desc    Create new department
 * @route   POST /api/departments
 * @access  ADMIN
 */
const createDepartment = async (req, res, next) => {
    try {
        const { department_name, department_code, description, head_id } = req.body;

        const department = await Department.create({
            department_name,
            department_code,
            description,
            head_id,
            status: 'ACTIVE'
        });

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: department
        });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Department code or name already exists'
            });
        }
        next(error);
    }
};

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Private
 */
const getAllDepartments = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const [departments, total] = await Promise.all([
            Department.find(query)
                .populate('head_id', 'employee_id email')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ department_name: 1 }),
            Department.countDocuments(query)
        ]);

        // Get employee count for each department
        const departmentsWithCount = await Promise.all(
            departments.map(async (dept) => {
                const employeeCount = await EmployeeProfile.countDocuments({
                    department: dept.department_code
                });
                return {
                    ...dept.toObject(),
                    employee_count: employeeCount
                };
            })
        );

        res.json({
            success: true,
            data: departmentsWithCount,
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
 * @desc    Get department by ID
 * @route   GET /api/departments/:id
 * @access  Private
 */
const getDepartmentById = async (req, res, next) => {
    try {
        const department = await Department.findById(req.params.id)
            .populate('head_id', 'employee_id email');

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        const employeeCount = await EmployeeProfile.countDocuments({
            department: department.department_code
        });

        res.json({
            success: true,
            data: {
                ...department.toObject(),
                employee_count: employeeCount
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update department
 * @route   PUT /api/departments/:id
 * @access  ADMIN
 */
const updateDepartment = async (req, res, next) => {
    try {
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('head_id', 'employee_id email');

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        res.json({
            success: true,
            message: 'Department updated successfully',
            data: department
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Department code or name already exists'
            });
        }
        next(error);
    }
};

/**
 * @desc    Delete department
 * @route   DELETE /api/departments/:id
 * @access  ADMIN
 */
const deleteDepartment = async (req, res, next) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // Check if department has employees
        const employeeCount = await EmployeeProfile.countDocuments({
            department: department.department_code
        });

        if (employeeCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete department with ${employeeCount} employees. Please reassign them first.`
            });
        }

        await department.deleteOne();

        res.json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get department employees
 * @route   GET /api/departments/:id/employees
 * @access  HR, ADMIN
 */
const getDepartmentEmployees = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        const skip = (page - 1) * limit;

        const [employees, total] = await Promise.all([
            EmployeeProfile.find({ department: department.department_code })
                .populate('user_id', 'employee_id email role')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ first_name: 1 }),
            EmployeeProfile.countDocuments({ department: department.department_code })
        ]);

        res.json({
            success: true,
            data: {
                department: department.department_name,
                employees
            },
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

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    getDepartmentEmployees
};
