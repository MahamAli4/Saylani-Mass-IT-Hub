const express = require('express');
const router = express.Router();
const { registerVolunteer, getAllVolunteers, getMyVolunteers } = require('../controllers/volunteerController');
const { protect } = require('../middleware/auth');

router.route('/my').get(protect, getMyVolunteers);

router.route('/')
    .get(protect, getAllVolunteers)
    .post(protect, registerVolunteer);

module.exports = router;
