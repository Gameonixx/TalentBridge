const Job = require('../models/Job');
const Application = require('../models/Application');
const { calculateMatchScore } = require('../services/matchService');

// @desc    Get recruiter dashboard stats
// @route   GET /api/recruiter/dashboard
// @access  Private (Recruiter)
const getDashboardStats = async (req, res, next) => {
  try {
    const recruiterId = req.user.id;

    // Get all jobs by recruiter
    const jobs = await Job.find({ recruiter: recruiterId });
    const jobIds = jobs.map(job => job._id);

    // Get all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('student', 'name')
      .populate('job', 'title status');

    const activeJobs = jobs.filter(job => job.status === 'open').length;
    const totalApplications = applications.length;
    const shortlisted = applications.filter(app => app.status === 'Shortlisted').length;
    const interviews = applications.filter(app => app.status === 'Interview Scheduled').length;

    // Get 5 most recent applicants
    const recentApplicants = applications
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(app => ({
        _id: app._id,
        name: app.student?.name || 'Unknown',
        role: app.job?.title || 'Unknown Role',
        status: app.status,
        date: app.createdAt
      }));

    res.status(200).json({
      activeJobs,
      totalApplications,
      shortlisted,
      interviews,
      recentApplicants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for a specific job
// @route   GET /api/recruiter/jobs/:jobId/applicants
// @access  Private (Recruiter)
const getJobApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Verify job exists and belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view applicants for this job');
    }

    const applications = await Application.find({ job: jobId })
      .populate('student', 'name email profile resumeAnalysis')
      .sort({ createdAt: -1 });

    const applicationsWithScores = applications.map(app => {
      const appObj = app.toObject();
      if (appObj.student && appObj.student.profile) {
        appObj.matchDetails = calculateMatchScore(appObj.student.profile, job, appObj.student.resumeAnalysis);
      }
      return appObj;
    });

    res.status(200).json(applicationsWithScores);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/recruiter/applications/:id/status
// @access  Private (Recruiter)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    if (application.job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this application');
    }

    application.status = status;
    const updatedApplication = await application.save();

    res.status(200).json(updatedApplication);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getJobApplicants,
  updateApplicationStatus
};
