const express = require('express');
const router = express.Router();
const {
    checkIn,
    checkOut,
    getMyAttendance,
    getAttendance,
    markAttendance,
    getAttendanceReport
} = require('../controllers/attendance.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');

/**
 * @swagger
 * /api/attendance/check-in:
 *   post:
 *     summary: Check in for the day
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully checked in
 */
router.post('/check-in', authenticate, checkIn);

/**
 * @swagger
 * /api/attendance/check-out:
 *   post:
 *     summary: Check out for the day
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully checked out
 */
router.post('/check-out', authenticate, checkOut);

/**
 * @swagger
 * /api/attendance/me:
 *   get:
 *     summary: Get my attendance records
 *     tags: [Attendance]
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
 *         description: List of attendance records
 */
router.get('/me', authenticate, getMyAttendance);

/**
 * @swagger
 * /api/attendance/report:
 *   get:
 *     summary: Get attendance report
 *     tags: [Attendance]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance report
 */
router.get('/report', authenticate, requireRole('HR', 'ADMIN'), getAttendanceReport);

/**
 * @swagger
 * /api/attendance/mark:
 *   post:
 *     summary: Manually mark attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance marked successfully
 */
router.post('/mark', authenticate, requireRole('HR', 'ADMIN'), markAttendance);

/**
 * @swagger
 * /api/attendance/{userId}:
 *   get:
 *     summary: Get attendance for specific user
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: User attendance records
 */
router.get('/:userId', authenticate, requireRole('HR', 'ADMIN'), getAttendance);

module.exports = router;
