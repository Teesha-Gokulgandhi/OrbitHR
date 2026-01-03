const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    employee_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password_hash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['EMPLOYEE', 'HR', 'ADMIN'],
        default: 'EMPLOYEE'
    },
    is_email_verified: {
        type: Boolean,
        default: false
    },
    verification_token: {
        type: String
    }
}, {
    timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ employee_id: 1 });

module.exports = mongoose.model('User', userSchema);
