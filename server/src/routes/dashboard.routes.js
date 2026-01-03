const express = require('express');
const router = express.Router();
const {
    getOverview,
    getEmployeeStats,
    getAttendanceStats,
    getLeaveStats,
    getMyDashboard
} = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');

/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     summary: Get system overview statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics
 */
router.get('/overview', authenticate, requireRole('HR', 'ADMIN'), getOverview);

/**
 * @swagger
 * /api/dashboard/employees:
 *   get:
 *     summary: Get employee statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee statistics
 */
router.get('/employees', authenticate, requireRole('HR', 'ADMIN'), getEmployeeStats);

/**
 * @swagger
 * /api/dashboard/attendance:
 *   get:
 *     summary: Get attendance statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Attendance statistics
 */
router.get('/attendance', authenticate, requireRole('HR', 'ADMIN'), getAttendanceStats);

/**
 * @swagger
 * /api/dashboard/leaves:
 *   get:
 *     summary: Get leave statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave statistics
 */
router.get('/leaves', authenticate, requireRole('HR', 'ADMIN'), getLeaveStats);

/**
 * @swagger
 * /api/dashboard/me:
 *   get:
 *     summary: Get personal dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personal dashboard data
 */
router.get('/me', authenticate, getMyDashboard);

module.exports = router;
