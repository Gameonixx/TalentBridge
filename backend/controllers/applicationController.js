const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Student)
const applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    
    // Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    if (job.status !== 'open') {
      res.status(400);
      throw new Error('Job is no longer open');
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      student: req.user.id,
      job: jobId
    });

    if (existingApplication) {
      res.status(400);
      throw new Error('You have already applied to this job');
    }

    const application = await Application.create({
      student: req.user.id,
      job: jobId,
      status: 'Applied'
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's applications
// @route   GET /api/applications/my
// @access  Private (Student)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('job', 'title company location ctc status')
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyToJob,
  getMyApplications
};
