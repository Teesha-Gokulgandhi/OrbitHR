const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    document_type: {
        type: String,
        required: true
    },
    document_name: {
        type: String,
        required: true
    },
    file_path: {
        type: String,
        required: true
    },
    file_size: {
        type: Number
    }
}, {
    timestamps: true
});

// Index
documentSchema.index({ user_id: 1 });

module.exports = mongoose.model('Document', documentSchema);
