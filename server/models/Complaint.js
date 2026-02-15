const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Internet', 'Electricity', 'Water', 'Maintenance'],
        required: true
    },
    description: { type: String, required: true },
    location: { type: String, default: 'Main Campus' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['Submitted', 'In Progress', 'Resolved'],
        default: 'Submitted'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
