const Job = require('../models/Job');
const User = require('../models/User');
const { calculateMatchScore } = require('../services/matchService');

// @desc    Calculate match score for a job
// @route   GET /api/match/job/:jobId
// @access  Private (Student)
const getJobMatch = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'student') {
      res.status(403);
      throw new Error('Only students can get match scores');
    }

    const matchResult = calculateMatchScore(user.profile, job, user.resumeAnalysis);
    res.status(200).json(matchResult);
  } catch (error) {
    console.error('Match Calculation Error:', error);
    next(error);
  }
};

module.exports = {
  getJobMatch
};
