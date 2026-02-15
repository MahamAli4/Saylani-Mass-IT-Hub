const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    event_name: { type: String, required: true },
    availability: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
