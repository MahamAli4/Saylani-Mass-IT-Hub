const express = require('express');
const router = express.Router();
const { submitComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus } = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getAllComplaints)
    .post(protect, submitComplaint);

router.get('/my', protect, getMyComplaints);
router.patch('/:id', protect, updateComplaintStatus);

module.exports = router;
