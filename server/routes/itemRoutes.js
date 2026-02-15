const express = require('express');
const router = express.Router();
const { createItem, getAllItems, getMyItems, updateItemStatus } = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getAllItems)
    .post(protect, createItem);

router.get('/my-items', protect, getMyItems);
router.patch('/:id', protect, updateItemStatus);

module.exports = router;
