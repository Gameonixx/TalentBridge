const { PDFParse } = require("pdf-parse");
const { analyzeResumeSemantics } = require("./aiResumeAnalyzer");

const KNOWN_SKILLS = [
  'javascript',
  'python',
  'java',
  'c++',
  'c#',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'go',
  'rust',
  'typescript',

  'react',
  'react.js',
  'angular',
  'vue',
  'node',
  'node.js',
  'express',

  'django',
  'flask',
  'spring',

  'mongodb',
  'postgresql',
  'mysql',
  'sql',

  'aws',
  'docker',
  'kubernetes',
  'git',

  'html',
  'css',
  'tailwind',

  'machine learning',
  'ml',
  'artificial intelligence',
  'ai',
  'data science',
  'tensorflow',
  'pytorch'
];


const KNOWN_TECH = {

  frontend: [
    'react',
    'react.js',
    'html',
    'css',
    'javascript',
    'tailwind',
    'vue',
    'angular'
  ],

  backend: [
    'node',
    'node.js',
    'express',
    'mongodb',
    'sql',
    'postgresql',
    'mysql',
    'django',
    'flask',
    'java',
    'spring'
  ],

  ai: [
    'python',
    'ml',
    'machine learning',
    'artificial intelligence',
    'ai',
    'tensorflow',
    'pytorch',
    'data science'
  ]

};


// Main text analyzer
const analyzeResumeText = async (text, profile = {}) => {

  try {

    const analysis = {
      extractedSkills: [],
      technologies: [],
      experienceKeywords: [],
      projects: []
    };


    let textToAnalyze = "";


    if (text) {
      textToAnalyze += text.toLowerCase();
    }


    if (profile.skills && Array.isArray(profile.skills)) {
      textToAnalyze += " " + profile.skills.join(" ").toLowerCase();
    }


    if (profile.githubUrl) {
      textToAnalyze += " " + profile.githubUrl.toLowerCase();
    }


    if (profile.linkedinUrl) {
      textToAnalyze += " " + profile.linkedinUrl.toLowerCase();
    }



    const extractedSkills = new Set();
    const technologies = new Set();
    const experienceKeywords = new Set();
    const projects = new Set();



    KNOWN_SKILLS.forEach(skill => {

      if (textToAnalyze.includes(skill)) {

        extractedSkills.add(skill);


        if (KNOWN_TECH.frontend.includes(skill)) {
          technologies.add("Frontend");
        }


        if (KNOWN_TECH.backend.includes(skill)) {
          technologies.add("Backend");
        }


        if (KNOWN_TECH.ai.includes(skill)) {
          technologies.add("AI/ML");
        }

      }

    });



    if (textToAnalyze.includes("intern")) {
      experienceKeywords.add("Internship");
    }


    if (
      textToAnalyze.includes("developer") ||
      textToAnalyze.includes("engineer")
    ) {
      experienceKeywords.add("Development Experience");
    }



    if (
      textToAnalyze.includes("project") ||
      textToAnalyze.includes("github") ||
      textToAnalyze.includes("built")
    ) {
      projects.add("Projects detected");
    }



    analysis.extractedSkills = [...extractedSkills];

    analysis.technologies = [...technologies];

    analysis.experienceKeywords = [...experienceKeywords];

    analysis.projects = [...projects];

    analysis.semanticAnalysis = analyzeResumeSemantics(textToAnalyze);

    console.log(
      "Resume intelligence generated safely:",
      analysis
    );

    return analysis;



  } catch (error) {

    console.log(
      "Resume analysis error:",
      error.message
    );


    return {
      extractedSkills: [],
      technologies: [],
      experienceKeywords: [],
      projects: []
    };

  }

};



// Old URL compatibility
const parseResumeUrl = async (url, profile = {}) => {

  return await analyzeResumeText(url, profile);

};




// Real PDF parser
const parseResumeBuffer = async (buffer, profile = {}) => {

  try {


    console.log(
      "Running PDF parser on uploaded buffer..."
    );

    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    await parser.destroy();

    console.log(
      "PDF extracted successfully length:",
      data.text.length
    );


    return await analyzeResumeText(
      data.text,
      profile
    );



  } catch (error) {


    console.error(
      "Error parsing PDF buffer:",
      error.message
    );


    return {
      extractedSkills: [],
      technologies: [],
      experienceKeywords: [],
      projects: []
    };

  }

};



module.exports = {

  parseResumeUrl,

  parseResumeBuffer

};