const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Announcement = require('../models/Announcement');
const { calculateMatchScore } = require('../services/aiMatchEngine');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const placedStudents = await Application.countDocuments({ status: 'Selected' });

    // AI Analytics Calculation
    const applications = await Application.find()
      .populate('student', 'profile resumeAnalysis')
      .populate('job', 'requirements');
    
    let totalScore = 0;
    let strongMatchCandidatesSet = new Set();
    
    applications.forEach(app => {
      if (app.student && app.student.profile && app.job) {
        const match = calculateMatchScore(app.student.profile, app.student.resumeAnalysis, app.job.requirements);
        totalScore += match.score;
        if (match.level === 'Strong Match') {
          strongMatchCandidatesSet.add(app.student._id.toString());
        }
      }
    });

    const averageCandidateMatchScore = applications.length > 0 ? Math.round(totalScore / applications.length) : 0;
    const strongMatchCandidates = strongMatchCandidatesSet.size;

    // Resumes Analyzed
    const studentsWithResumes = await User.find({ role: 'student' }, 'profile');
    let totalResumesAnalyzed = 0;
    studentsWithResumes.forEach(student => {
      if (student.profile && student.profile.resumeAnalysis && student.profile.resumeAnalysis.extractedSkills && student.profile.resumeAnalysis.extractedSkills.length > 0) {
        totalResumesAnalyzed++;
      } else if (student.profile && student.profile.resumeUrl) {
          // If they have a URL but no extracted skills yet, we can count it or not based on the requirement.
          // Let's count if they have a non-empty semantic analysis or extracted skills
          if (student.profile.resumeAnalysis && student.profile.resumeAnalysis.semanticAnalysis) {
              totalResumesAnalyzed++;
          }
      }
    });

    // Let's refine totalResumesAnalyzed check:
    totalResumesAnalyzed = studentsWithResumes.filter(student => 
      student.profile && student.profile.resumeAnalysis && 
      (student.profile.resumeAnalysis.extractedSkills?.length > 0 || student.profile.resumeAnalysis.semanticAnalysis?.skills?.length > 0)
    ).length;

    res.status(200).json({
      totalStudents,
      totalRecruiters,
      totalJobs,
      totalApplications,
      placedStudents,
      averageCandidateMatchScore,
      strongMatchCandidates,
      totalResumesAnalyzed
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAdminStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    const applications = await Application.find().populate('job', 'title company');

    const studentsWithDetails = students.map(student => {
      const studentApps = applications.filter(app => app.student.toString() === student._id.toString());
      const isPlaced = studentApps.some(app => app.status === 'Selected');
      const placedCompany = isPlaced ? studentApps.find(app => app.status === 'Selected').job.company : null;

      // AI Profile Strength
      let aiProfileStrength = 'Weak';
      const resumeAnalysis = student.profile?.resumeAnalysis || {};
      const semantic = resumeAnalysis.semanticAnalysis || {};
      if (semantic.skills && semantic.skills.length > 10) aiProfileStrength = 'Strong';
      else if (semantic.skills && semantic.skills.length > 5) aiProfileStrength = 'Good';

      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        branch: student.profile?.branch || 'N/A',
        cgpa: student.profile?.cgpa || 'N/A',
        skills: student.profile?.skills || [],
        totalApplications: studentApps.length,
        status: isPlaced ? 'Placed' : 'Unplaced',
        placedCompany,
        resumeUploaded: !!student.profile?.resumeUrl,
        aiProfileStrength
      };
    });

    res.status(200).json(studentsWithDetails);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies/recruiters
// @route   GET /api/admin/companies
// @access  Private (Admin)
const getAdminCompanies = async (req, res, next) => {
  try {
    const recruiters = await User.find({ role: 'recruiter' }).select('-password');
    const jobs = await Job.find();
    const applications = await Application.find();

    const companiesWithDetails = recruiters.map(recruiter => {
      const recruiterJobs = jobs.filter(job => job.recruiter.toString() === recruiter._id.toString());
      const jobIds = recruiterJobs.map(job => job._id.toString());
      const recruiterApps = applications.filter(app => jobIds.includes(app.job.toString()));

      return {
        _id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        company: recruiter.company || 'N/A',
        jobsPosted: recruiterJobs.length,
        totalApplicants: recruiterApps.length
      };
    });

    res.status(200).json(companiesWithDetails);
  } catch (error) {
    next(error);
  }
};

// @desc    Create an announcement
// @route   POST /api/admin/announcements
// @access  Private (Admin)
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      createdBy: req.user.id
    });

    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAdminStudents,
  getAdminCompanies,
  createAnnouncement
};
