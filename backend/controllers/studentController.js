const User = require('../models/User');

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student)
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // If profile does not exist, create empty default profile automatically
    if (!user.profile) {
      user.profile = {
        college: '',
        branch: '',
        graduationYear: null,
        cgpa: null,
        skills: [],
        resumeUrl: '',
        githubUrl: '',
        linkedinUrl: '',
        experience: []
      };
      await user.save();
    }

    const userData = user.toObject();
    
    // Map backend model keys to frontend expected keys to prevent UI breakage
    userData.profile = {
      ...userData.profile,
      year: userData.profile.graduationYear,
      resume: userData.profile.resumeUrl,
      github: userData.profile.githubUrl,
      linkedin: userData.profile.linkedinUrl
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('GET Profile Error:', error);
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (Student)
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Accept both old and new field names to prevent frontend mismatch
    const { 
      college, 
      branch, 
      graduationYear, year, 
      cgpa, 
      skills, 
      resumeUrl, resume, 
      githubUrl, github, 
      linkedinUrl, linkedin, 
      experience 
    } = req.body;
    
    // Create profile object if it doesn't exist
    if (!user.profile) {
      user.profile = {};
    }

    user.profile = {
      ...user.profile,
      college: college !== undefined ? college : user.profile.college,
      branch: branch !== undefined ? branch : user.profile.branch,
      graduationYear: graduationYear || year || user.profile.graduationYear,
      cgpa: cgpa !== undefined ? cgpa : user.profile.cgpa,
      skills: skills || user.profile.skills,
      resumeUrl: resumeUrl || resume || user.profile.resumeUrl,
      githubUrl: githubUrl || github || user.profile.githubUrl,
      linkedinUrl: linkedinUrl || linkedin || user.profile.linkedinUrl,
      experience: experience || user.profile.experience
    };

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('PUT Profile Error:', error);
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
