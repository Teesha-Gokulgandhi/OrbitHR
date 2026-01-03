const express = require('express');
const router = express.Router();
const {
    getAllEmployees,
    getEmployeeById,
    getMyProfile,
    updateMyProfile,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats
} = require('../controllers/employee.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: designation
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of employees
 */
router.get('/', authenticate, requireRole('HR', 'ADMIN'), getAllEmployees);

/**
 * @swagger
 * /api/employees/stats:
 *   get:
 *     summary: Get employee statistics
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee statistics
 */
router.get('/stats', authenticate, requireRole('HR', 'ADMIN'), getEmployeeStats);

/**
 * @swagger
 * /api/employees/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/me', authenticate, getMyProfile);

/**
 * @swagger
 * /api/employees/me:
 *   put:
 *     summary: Update my profile
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/me', authenticate, updateMyProfile);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
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
 *         description: Employee details
 */
router.get('/:id', authenticate, getEmployeeById);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Update employee
 *     tags: [Employees]
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
 *         description: Employee updated
 */
router.put('/:id', authenticate, requireRole('HR', 'ADMIN'), updateEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Delete employee
 *     tags: [Employees]
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
 *         description: Employee deleted
 */
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteEmployee);

module.exports = router;
