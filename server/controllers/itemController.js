const LostFound = require('../models/LostFound');

// @desc    Create new item
// @route   POST /api/items
exports.createItem = async (req, res) => {
    try {
        const { title, description, image_url, type, location } = req.body;
        const item = await LostFound.create({
            title,
            description,
            image_url,
            type,
            location,
            user_id: req.user._id
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all items
// @route   GET /api/items
exports.getAllItems = async (req, res) => {
    try {
        const items = await LostFound.find().populate('user_id', 'name email');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user items
// @route   GET /api/items/my-items
exports.getMyItems = async (req, res) => {
    try {
        const items = await LostFound.find({ user_id: req.user._id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update item status
// @route   PATCH /api/items/:id
exports.updateItemStatus = async (req, res) => {
    try {
        const item = await LostFound.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Check ownership or admin role
        if (item.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this status' });
        }

        item.status = req.body.status || item.status;
        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
