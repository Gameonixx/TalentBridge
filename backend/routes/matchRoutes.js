const express = require('express');
const router = express.Router();
const { getJobMatch } = require('../controllers/matchController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/job/:jobId')
  .get(protect, authorize('student'), getJobMatch);

module.exports = router;
