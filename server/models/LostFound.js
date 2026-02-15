const mongoose = require('mongoose');

const LostFoundSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image_url: { type: String },
    location: { type: String, default: 'Main Campus' },
    type: { type: String, enum: ['lost', 'found'], required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LostFound', LostFoundSchema);
