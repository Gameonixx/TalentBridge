const Job = require('../models/Job');

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
const createJob = async (req, res, next) => {
  try {
    const { title, description, requirements, location, salaryRange, company, ctc, cgpaCriteria, deadline } = req.body;

    if (!title || !description || !requirements) {
      res.status(400);
      throw new Error('Please provide title, description and requirements');
    }

    const job = await Job.create({
      recruiter: req.user.id,
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : requirements.split(',').map(r => r.trim()),
      location,
      salaryRange,
      company: company || req.user.company, // fallback to user's company
      ctc,
      cgpaCriteria,
      deadline,
      status: 'open'
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res, next) => {
  try {
    let query = {};
    
    // If recruiter, only show their own jobs by default, unless requested otherwise
    if (req.user.role === 'recruiter') {
      query.recruiter = req.user.id;
    }
    
    // If student, only show open jobs
    if (req.user.role === 'student') {
      query.status = 'open';
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name company email')
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiter', 'name company email');

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter/Admin)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Make sure user is the recruiter who created the job
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this job');
    }

    const { title, description, requirements, location, salaryRange, company, ctc, cgpaCriteria, deadline, status } = req.body;

    job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        requirements: requirements ? (Array.isArray(requirements) ? requirements : requirements.split(',').map(r => r.trim())) : job.requirements,
        location,
        salaryRange,
        company,
        ctc,
        cgpaCriteria,
        deadline,
        status: status || job.status
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Make sure user is the recruiter who created the job
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this job');
    }

    await job.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
};
