const express = require('express');
const router = express.Router();
const { applyToJob, getMyApplications } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/my')
  .get(protect, authorize('student'), getMyApplications);

router.route('/:jobId')
  .post(protect, authorize('student'), applyToJob);

module.exports = router;
