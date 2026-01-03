const express = require('express');
const { body } = require('express-validator');
const { signup, signin, getCurrentUser } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { validatePasswordStrength } = require('../utils/password');

const router = express.Router();

// Validation rules
const signupValidation = [
    body('employee_id')
        .trim()
        .notEmpty()
        .withMessage('Employee ID is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Employee ID must be between 3 and 50 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .custom((value) => {
            const validation = validatePasswordStrength(value);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            return true;
        }),
    body('role')
        .optional()
        .isIn(['EMPLOYEE', 'HR', 'ADMIN'])
        .withMessage('Role must be either EMPLOYEE, HR, or ADMIN'),
];

const signinValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/signup', validate(signupValidation), signup);
router.post('/signin', validate(signinValidation), signin);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
