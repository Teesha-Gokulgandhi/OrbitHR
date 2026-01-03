const Document = require('../models/Document');
const path = require('path');
const fs = require('fs').promises;

/**
 * @desc    Upload document
 * @route   POST /api/documents
 * @access  Private
 */
const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const { document_type, document_name } = req.body;

        const document = await Document.create({
            user_id: req.user.id,
            document_type,
            document_name: document_name || req.file.originalname,
            file_path: req.file.path,
            file_size: req.file.size
        });

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            data: document
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get my documents
 * @route   GET /api/documents/me
 * @access  Private
 */
const getMyDocuments = async (req, res, next) => {
    try {
        const { document_type, page = 1, limit = 10 } = req.query;

        const query = { user_id: req.user.id };
        if (document_type) query.document_type = document_type;

        const skip = (page - 1) * limit;

        const [documents, total] = await Promise.all([
            Document.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Document.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: documents,
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
 * @desc    Get employee documents
 * @route   GET /api/documents/user/:userId
 * @access  HR, ADMIN
 */
const getEmployeeDocuments = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { document_type, page = 1, limit = 10 } = req.query;

        const query = { user_id: userId };
        if (document_type) query.document_type = document_type;

        const skip = (page - 1) * limit;

        const [documents, total] = await Promise.all([
            Document.find(query)
                .populate('user_id', 'employee_id email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Document.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: documents,
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
 * @desc    Download document
 * @route   GET /api/documents/:id/download
 * @access  Private (own documents) or HR/ADMIN
 */
const downloadDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Check authorization
        if (document.user_id.toString() !== req.user.id && !['HR', 'ADMIN'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if file exists
        try {
            await fs.access(document.file_path);
        } catch (err) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }

        res.download(document.file_path, document.document_name);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete document
 * @route   DELETE /api/documents/:id
 * @access  Private (own documents) or HR/ADMIN
 */
const deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Check authorization
        if (document.user_id.toString() !== req.user.id && !['HR', 'ADMIN'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Delete file from filesystem
        try {
            await fs.unlink(document.file_path);
        } catch (err) {
            console.warn('File not found on filesystem:', err);
        }

        await document.deleteOne();

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadDocument,
    getMyDocuments,
    getEmployeeDocuments,
    downloadDocument,
    deleteDocument
};
