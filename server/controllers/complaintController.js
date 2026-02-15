const Complaint = require('../models/Complaint');

// @desc    Submit new complaint
// @route   POST /api/complaints
exports.submitComplaint = async (req, res) => {
    try {
        const { category, description, location } = req.body;
        const complaint = await Complaint.create({
            category,
            description,
            location,
            user_id: req.user._id
        });
        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my complaints
// @route   GET /api/complaints/my
exports.getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user_id: req.user._id });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all complaints (Admin)
// @route   GET /api/complaints
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('user_id', 'name email');
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id
exports.updateComplaintStatus = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        // Check ownership or admin role
        if (complaint.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this status' });
        }

        complaint.status = req.body.status || complaint.status;
        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
