const express = require('express');
const router = express.Router();
const { getDashboardStats, getJobApplicants, updateApplicationStatus } = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/dashboard')
  .get(protect, authorize('recruiter', 'admin'), getDashboardStats);

router.route('/jobs/:jobId/applicants')
  .get(protect, authorize('recruiter', 'admin'), getJobApplicants);

router.route('/applications/:id/status')
  .put(protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
