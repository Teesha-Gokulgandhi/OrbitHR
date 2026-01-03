const express = require('express');
const router = express.Router();
const {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    getDepartmentEmployees
} = require('../controllers/department.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create new department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department_name:
 *                 type: string
 *               department_code:
 *                 type: string
 *               description:
 *                 type: string
 *               head_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Department created
 */
router.post(
    '/',
    authenticate,
    requireRole('ADMIN'),
    [
        body('department_name').notEmpty().withMessage('Department name is required'),
        body('department_code').notEmpty().withMessage('Department code is required')
    ],
    validate,
    createDepartment
);

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of departments
 */
router.get('/', authenticate, getAllDepartments);

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department details
 */
router.get('/:id', authenticate, getDepartmentById);

/**
 * @swagger
 * /api/departments/{id}/employees:
 *   get:
 *     summary: Get employees in department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of employees
 */
router.get('/:id/employees', authenticate, requireRole('HR', 'ADMIN'), getDepartmentEmployees);

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     summary: Update department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department updated
 */
router.put('/:id', authenticate, requireRole('ADMIN'), updateDepartment);

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: Delete department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department deleted
 */
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteDepartment);

module.exports = router;
