const Volunteer = require('../models/Volunteer');

// @desc    Register as volunteer
// @route   POST /api/volunteers
exports.registerVolunteer = async (req, res) => {
    try {
        const { name, event_name, availability } = req.body;
        const volunteer = await Volunteer.create({
            name,
            event_name,
            availability,
            user_id: req.user._id
        });
        res.status(201).json(volunteer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's volunteers
// @route   GET /api/volunteers/my
exports.getMyVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find({ user_id: req.user._id });
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all volunteers
// @route   GET /api/volunteers
exports.getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find().populate('user_id', 'name email role');
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
