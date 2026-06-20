const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/profile')
  .get(protect, authorize('student'), getProfile)
  .put(protect, authorize('student'), updateProfile);

module.exports = router;
