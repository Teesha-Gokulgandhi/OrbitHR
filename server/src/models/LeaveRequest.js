const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leave_type: {
        type: String,
        enum: ['PAID', 'SICK', 'UNPAID'],
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    total_days: {
        type: Number,
        required: true
    },
    reason: {
        type: String
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approval_comments: {
        type: String
    },
    approved_at: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes
leaveRequestSchema.index({ user_id: 1 });
leaveRequestSchema.index({ status: 1 });
leaveRequestSchema.index({ start_date: 1, end_date: 1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
