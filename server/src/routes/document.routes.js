const express = require('express');
const router = express.Router();
const {
    uploadDocument,
    getMyDocuments,
    getEmployeeDocuments,
    downloadDocument,
    deleteDocument
} = require('../controllers/document.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');
const { uploadDocument: uploadMiddleware } = require('../utils/upload');

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Upload document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               document_type:
 *                 type: string
 *               document_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document uploaded
 */
router.post('/', authenticate, uploadMiddleware, uploadDocument);

/**
 * @swagger
 * /api/documents/me:
 *   get:
 *     summary: Get my documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: document_type
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
 *         description: List of documents
 */
router.get('/me', authenticate, getMyDocuments);

/**
 * @swagger
 * /api/documents/user/{userId}:
 *   get:
 *     summary: Get employee documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: document_type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of employee documents
 */
router.get('/user/:userId', authenticate, requireRole('HR', 'ADMIN'), getEmployeeDocuments);

/**
 * @swagger
 * /api/documents/{id}/download:
 *   get:
 *     summary: Download document
 *     tags: [Documents]
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
 *         description: Document file
 */
router.get('/:id/download', authenticate, downloadDocument);

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Delete document
 *     tags: [Documents]
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
 *         description: Document deleted
 */
router.delete('/:id', authenticate, deleteDocument);

module.exports = router;
