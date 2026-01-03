const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    check_in: {
        type: String // Stored as "HH:MM:SS"
    },
    check_out: {
        type: String // Stored as "HH:MM:SS"
    },
    status: {
        type: String,
        enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE'],
        default: 'PRESENT'
    },
    total_hours: {
        type: Number
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

// Compound index for user and date
attendanceSchema.index({ user_id: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
