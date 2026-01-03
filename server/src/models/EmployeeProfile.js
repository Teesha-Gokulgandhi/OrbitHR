const mongoose = require('mongoose');

const employeeProfileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String
    },
    date_of_birth: {
        type: Date
    },
    gender: {
        type: String
    },
    profile_picture: {
        type: String
    },
    // Job Details
    designation: {
        type: String
    },
    department: {
        type: String
    },
    joining_date: {
        type: Date
    },
    employment_type: {
        type: String
    },
    // Emergency Contact
    emergency_contact_name: {
        type: String
    },
    emergency_contact_phone: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes
employeeProfileSchema.index({ user_id: 1 });
employeeProfileSchema.index({ department: 1 });

module.exports = mongoose.model('EmployeeProfile', employeeProfileSchema);
