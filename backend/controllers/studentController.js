const User = require('../models/User');
const { parseResumeUrl, parseResumeBuffer } = require('../services/resumeParser');
const fs = require("fs");


// DEFAULT RESUME ANALYSIS OBJECT
const defaultResumeAnalysis = {
  extractedSkills: [],
  technologies: [],
  experienceKeywords: [],
  projects: []
};


// GET STUDENT PROFILE
const getProfile = async (req, res, next) => {

  try {

    const user = await User
      .findById(req.user._id)
      .select('-password');


    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }


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
        experience: [],
        resumeAnalysis: defaultResumeAnalysis

      };

      await user.save();

    }



    const userData = user.toObject();



    userData.profile = {

      ...userData.profile,

      year: userData.profile.graduationYear,

      resume: userData.profile.resumeUrl,

      github: userData.profile.githubUrl,

      linkedin: userData.profile.linkedinUrl

    };



    res.status(200).json(userData);



  } catch (error) {

    console.error(
      "GET Profile Error:",
      error
    );

    next(error);

  }

};




// UPDATE PROFILE

const updateProfile = async (req, res, next) => {


  try {


    const user = await User.findById(req.user._id);


    if (!user) {

      res.status(404);
      throw new Error("User not found");

    }



    const {

      college,
      branch,
      graduationYear,
      year,
      cgpa,
      skills,

      resumeUrl,
      resume,

      githubUrl,
      github,

      linkedinUrl,
      linkedin,

      experience


    } = req.body;




    if (!user.profile) {

      user.profile = {};

    }



    const oldAnalysis =
      user.profile.resumeAnalysis || defaultResumeAnalysis;



    user.profile = {


      ...user.profile,


      college:
        college !== undefined
          ? college
          : user.profile.college,


      branch:
        branch !== undefined
          ? branch
          : user.profile.branch,


      graduationYear:
        graduationYear ||
        year ||
        user.profile.graduationYear,


      cgpa:
        cgpa !== undefined
          ? cgpa
          : user.profile.cgpa,


      skills:
        skills ||
        user.profile.skills,


      resumeUrl:
        resumeUrl ||
        resume ||
        user.profile.resumeUrl,


      githubUrl:
        githubUrl ||
        github ||
        user.profile.githubUrl,


      linkedinUrl:
        linkedinUrl ||
        linkedin ||
        user.profile.linkedinUrl,


      experience:
        experience ||
        user.profile.experience,


      resumeAnalysis: oldAnalysis


    };




    // URL RESUME PARSING

    const newResumeUrl =
      resumeUrl ||
      resume;



    if (newResumeUrl) {


      console.log(
        "Running resume intelligence parser..."
      );


      const analysis =
        await parseResumeUrl(
          newResumeUrl,
          user.profile
        );



      user.profile.resumeAnalysis =
        analysis || defaultResumeAnalysis;


    }



    const updatedUser =
      await user.save();



    res.status(200).json(updatedUser);



  } catch (error) {


    console.error(
      "PUT Profile Error:",
      error
    );


    next(error);


  }


};






// UPLOAD PDF RESUME

const uploadResume = async (req, res, next) => {


  try {

    console.log("Resume upload API hit");
    console.log(req.file ? req.file.originalname : 'No file');

    const user =
      await User.findById(req.user._id);



    if (!user) {

      res.status(404);

      throw new Error(
        "User not found"
      );

    }




    if (!req.file) {

      res.status(400);

      throw new Error(
        "Please upload PDF"
      );

    }




    if (!user.profile) {

      user.profile = {};

    }



    console.log(
      "Running PDF parser on uploaded buffer..."
    );




    const buffer = fs.readFileSync(req.file.path);

    const analysis =
      await parseResumeBuffer(
        buffer,
        user.profile
      );

    user.profile.resumeUrl =
      "/uploads/resumes/" + req.file.filename;

    console.log("Saved resume URL:", user.profile.resumeUrl);



    user.profile.resumeAnalysis =
      analysis || defaultResumeAnalysis;




    const updatedUser =
      await user.save();



    console.log(
      "Resume saved successfully"
    );



    res.status(200)
      .json(updatedUser);




  } catch (error) {


    console.error(
      "POST Resume Error:",
      error
    );


    next(error);


  }


};




module.exports = {

  getProfile,

  updateProfile,

  uploadResume

};