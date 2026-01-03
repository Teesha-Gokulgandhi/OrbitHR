const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { AppError } = require('../middleware/errorHandler');
const crypto = require('crypto');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employee_id
 *               - email
 *               - password
 *             properties:
 *               employee_id:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [EMPLOYEE, HR, ADMIN]
 *     responses:
 *       201:
 *         description: User created successfully
 */
const signup = async (req, res) => {
    try {
        const { employee_id, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { employee_id }] });
        if (existingUser) {
            throw new AppError('User with this email or employee ID already exists', 400);
        }

        // Hash password
        const password_hash = await hashPassword(password);

        // Create user
        const user = await User.create({
            employee_id,
            email,
            password_hash,
            role: role || 'EMPLOYEE',
            verification_token: crypto.randomBytes(32).toString('hex'),
            is_email_verified: true // Auto-verified for dev
        });

        // Generate token
        const token = generateToken({
            id: user._id,
            employee_id: user.employee_id,
            email: user.email,
            role: user.role,
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    employee_id: user.employee_id,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message,
        });
    }
};

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in to the system
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        const isPasswordValid = await comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        if (!user.is_email_verified) {
            throw new AppError('Please verify your email before signing in', 401);
        }

        const token = generateToken({
            id: user._id,
            employee_id: user.employee_id,
            email: user.email,
            role: user.role,
        });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    employee_id: user.employee_id,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error signing in',
            error: error.message,
        });
    }
};

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved
 */
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password_hash');
        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.json({
            success: true,
            message: 'User information retrieved',
            data: user,
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error retrieving user information',
            error: error.message,
        });
    }
};

module.exports = { signup, signin, getCurrentUser };
