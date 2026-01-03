const express = require('express');
const router = express.Router();
const {
    createPayroll,
    updatePayroll,
    getMyPayroll,
    getPayrollByUserId,
    getAllPayrolls,
    generatePayslip,
    deletePayroll
} = require('../controllers/payroll.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

/**
 * @swagger
 * /api/payroll:
 *   post:
 *     summary: Create payroll record
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Payroll created
 */
router.post(
    '/',
    authenticate,
    requireRole('HR', 'ADMIN'),
    [
        body('user_id').isMongoId().withMessage('Invalid user ID'),
        body('basic_salary').isNumeric().withMessage('Basic salary must be a number')
    ],
    validate,
    createPayroll
);

/**
 * @swagger
 * /api/payroll/me:
 *   get:
 *     summary: Get my payroll information
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payroll details
 */
router.get('/me', authenticate, getMyPayroll);

/**
 * @swagger
 * /api/payroll:
 *   get:
 *     summary: Get all payrolls
 *     tags: [Payroll]
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
 *     responses:
 *       200:
 *         description: List of payrolls
 */
router.get('/', authenticate, requireRole('HR', 'ADMIN'), getAllPayrolls);

/**
 * @swagger
 * /api/payroll/user/{userId}:
 *   get:
 *     summary: Get payroll by user ID
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payroll details
 */
router.get('/user/:userId', authenticate, requireRole('HR', 'ADMIN'), getPayrollByUserId);

/**
 * @swagger
 * /api/payroll/{id}:
 *   put:
 *     summary: Update payroll
 *     tags: [Payroll]
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
 *         description: Payroll updated
 */
router.put('/:id', authenticate, requireRole('HR', 'ADMIN'), updatePayroll);

/**
 * @swagger
 * /api/payroll/{id}/payslip:
 *   post:
 *     summary: Generate payslip
 *     tags: [Payroll]
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
 *         description: Payslip generation initiated
 */
router.post('/:id/payslip', authenticate, generatePayslip);

/**
 * @swagger
 * /api/payroll/{id}:
 *   delete:
 *     summary: Delete payroll
 *     tags: [Payroll]
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
 *         description: Payroll deleted
 */
router.delete('/:id', authenticate, requireRole('ADMIN'), deletePayroll);

module.exports = router;
