const express = require('express');
const router = express.Router();
const {
    createLeaveRequest,
    getMyLeaves,
    getAllLeaves,
    getLeaveById,
    approveLeave,
    rejectLeave,
    cancelLeave,
    getLeaveBalance
} = require('../controllers/leave.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

/**
 * @swagger
 * /api/leaves:
 *   post:
 *     summary: Create new leave request
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leave_type:
 *                 type: string
 *                 enum: [PAID, SICK, UNPAID]
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Leave request created
 */
router.post(
    '/',
    authenticate,
    [
        body('leave_type').isIn(['PAID', 'SICK', 'UNPAID']).withMessage('Invalid leave type'),
        body('start_date').isISO8601().withMessage('Invalid start date'),
        body('end_date').isISO8601().withMessage('Invalid end date'),
        body('reason').optional().isString()
    ],
    validate,
    createLeaveRequest
);

/**
 * @swagger
 * /api/leaves/me:
 *   get:
 *     summary: Get my leave requests
 *     tags: [Leaves]
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
 *         description: List of leave requests
 */
router.get('/me', authenticate, getMyLeaves);

/**
 * @swagger
 * /api/leaves/balance:
 *   get:
 *     summary: Get my leave balance
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave balance
 */
router.get('/balance', authenticate, getLeaveBalance);

/**
 * @swagger
 * /api/leaves:
 *   get:
 *     summary: Get all leave requests
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: leave_type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all leave requests
 */
router.get('/', authenticate, requireRole('HR', 'ADMIN'), getAllLeaves);

/**
 * @swagger
 * /api/leaves/{id}:
 *   get:
 *     summary: Get leave request by ID
 *     tags: [Leaves]
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
 *         description: Leave request details
 */
router.get('/:id', authenticate, getLeaveById);

/**
 * @swagger
 * /api/leaves/{id}/approve:
 *   put:
 *     summary: Approve leave request
 *     tags: [Leaves]
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
 *         description: Leave approved
 */
router.put('/:id/approve', authenticate, requireRole('HR', 'ADMIN'), approveLeave);

/**
 * @swagger
 * /api/leaves/{id}/reject:
 *   put:
 *     summary: Reject leave request
 *     tags: [Leaves]
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
 *         description: Leave rejected
 */
router.put('/:id/reject', authenticate, requireRole('HR', 'ADMIN'), rejectLeave);

/**
 * @swagger
 * /api/leaves/{id}:
 *   delete:
 *     summary: Cancel leave request
 *     tags: [Leaves]
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
 *         description: Leave cancelled
 */
router.delete('/:id', authenticate, cancelLeave);

module.exports = router;
