const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    basic_salary: {
        type: Number,
        required: true,
        min: 0
    },
    hra: {
        type: Number,
        default: 0,
        min: 0
    },
    transport_allowance: {
        type: Number,
        default: 0,
        min: 0
    },
    medical_allowance: {
        type: Number,
        default: 0,
        min: 0
    },
    special_allowance: {
        type: Number,
        default: 0,
        min: 0
    },
    gross_salary: {
        type: Number,
        required: true,
        min: 0
    },
    pf_deduction: {
        type: Number,
        default: 0,
        min: 0
    },
    tax_deduction: {
        type: Number,
        default: 0,
        min: 0
    },
    other_deductions: {
        type: Number,
        default: 0,
        min: 0
    },
    net_salary: {
        type: Number,
        required: true,
        min: 0
    },
    pay_frequency: {
        type: String,
        default: 'MONTHLY'
    },
    bank_name: {
        type: String
    },
    account_number: {
        type: String
    },
    ifsc_code: {
        type: String
    }
}, {
    timestamps: true
});

// Index
payrollSchema.index({ user_id: 1 });

module.exports = mongoose.model('Payroll', payrollSchema);
