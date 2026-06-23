const User = require('../models/User');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { generateCandidateReport, generateInterviewQuestions, calculatePlacementReadiness } = require('../services/aiCandidateService');

const getStudentIntelligence = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const user = req.user;

    // Security Check
    if (user.role === 'student') {
      if (user._id.toString() !== studentId) {
        return res.status(403).json({ message: 'Not authorized to view other student reports' });
      }
    } else if (user.role === 'recruiter') {
      // Check if student applied to any job posted by this recruiter
      const applications = await Application.find({ student: studentId }).populate('job');
      const hasApplied = applications.some(app => app.job && app.job.recruiter.toString() === user._id.toString());
      if (!hasApplied) {
        return res.status(403).json({ message: 'Not authorized to view candidates who have not applied to your jobs' });
      }
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check Cache
    if (student.profile && student.profile.aiAnalysisCache && student.profile.aiAnalysisCache.report && student.profile.aiAnalysisCache.readiness) {
      // Already generated, return cached
      return res.json({
        report: student.profile.aiAnalysisCache.report,
        readiness: student.profile.aiAnalysisCache.readiness,
        cached: true,
        generatedAt: student.profile.aiAnalysisCache.generatedAt
      });
    }

    // Generate new intelligence
    const report = generateCandidateReport(student);
    const readiness = calculatePlacementReadiness(student);

    // Cache it
    if (!student.profile) student.profile = {};
    student.profile.aiAnalysisCache = {
      report,
      readiness,
      generatedAt: new Date()
    };
    await student.save();

    res.json({
      report,
      readiness,
      cached: false,
      generatedAt: student.profile.aiAnalysisCache.generatedAt
    });

  } catch (error) {
    console.error('Error fetching student intelligence:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getInterviewQuestions = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const jobId = req.query.jobId;
    const user = req.user;

    // Security Check
    if (user.role === 'student' && user._id.toString() !== studentId) {
      return res.status(403).json({ message: 'Not authorized' });
    } else if (user.role === 'recruiter') {
      const applications = await Application.find({ student: studentId }).populate('job');
      const hasApplied = applications.some(app => app.job && app.job.recruiter.toString() === user._id.toString());
      if (!hasApplied) return res.status(403).json({ message: 'Not authorized' });
    }

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    let jobRequirements = [];
    if (jobId) {
      const job = await Job.findById(jobId);
      if (job && job.requirements) {
        jobRequirements = job.requirements;
      }
    }

    const analysis = student.profile?.resumeAnalysis || {};
    const extractedSkills = analysis.extractedSkills || analysis.semanticAnalysis?.skills || [];
    const profileSkills = student.profile?.skills || [];
    const allSkills = [...new Set([...extractedSkills, ...profileSkills])];

    const questions = generateInterviewQuestions(allSkills, jobRequirements);

    res.json({ questions });

  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getStudentIntelligence,
  getInterviewQuestions
};
