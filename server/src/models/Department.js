const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    department_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    department_code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    head_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    }
}, {
    timestamps: true
});

// Virtual for employee count
departmentSchema.virtual('employee_count', {
    ref: 'EmployeeProfile',
    localField: '_id',
    foreignField: 'department',
    count: true
});

// Indexes
departmentSchema.index({ department_code: 1 });
departmentSchema.index({ status: 1 });

module.exports = mongoose.model('Department', departmentSchema);
