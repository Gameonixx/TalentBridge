const generateCandidateReport = (student) => {
  const studentProfile = student.profile || {};
  const analysis = studentProfile.resumeAnalysis || {};
  const extractedSkills = analysis.extractedSkills || analysis.semanticAnalysis?.skills || [];
  const profileSkills = studentProfile.skills || [];
  const allSkills = [...new Set([...extractedSkills, ...profileSkills])];
  const projects = studentProfile.projects || [];
  const experienceKeywords = analysis.experienceKeywords || [];

  let summary = "";
  if (allSkills.length > 0) {
    summary += `${student.name || 'Candidate'} has exposure to ${allSkills.slice(0, 3).join(', ')}. `;
  } else {
    summary += `${student.name || 'Candidate'} has an uploaded profile. `;
  }

  if (projects.length > 0 || (analysis.projects && analysis.projects.length > 0)) {
    summary += "Candidate has practical project exposure. ";
  }
  
  const strengths = [];
  const improvements = [];
  const reasons = [];

  if (allSkills.length >= 5) {
    strengths.push("Good technical skill diversity");
    reasons.push(`${allSkills.length} technical skills detected`);
  } else {
    improvements.push("Expand technical skill stack");
    reasons.push(`Only ${allSkills.length} technical skills detected`);
  }

  const frontendKeywords = ['react', 'angular', 'vue', 'html', 'css', 'frontend'];
  const backendKeywords = ['node', 'express', 'django', 'spring', 'backend', 'api', 'java', 'python'];
  const dbKeywords = ['mongo', 'sql', 'postgres', 'database'];

  const hasFrontend = allSkills.some(s => frontendKeywords.some(f => s.toLowerCase().includes(f)));
  const hasBackend = allSkills.some(s => backendKeywords.some(b => s.toLowerCase().includes(b)));
  const hasDb = allSkills.some(s => dbKeywords.some(d => s.toLowerCase().includes(d)));

  if (hasFrontend) { strengths.push("Frontend development experience"); reasons.push("Frontend skills detected"); }
  if (hasBackend) { strengths.push("Backend API experience"); reasons.push("Backend experience found"); }
  if (hasDb) { strengths.push("Database knowledge"); reasons.push("Database skills detected"); }

  if (hasFrontend && !hasBackend) { improvements.push("Add backend/API exposure"); }
  if (hasBackend && !hasFrontend) { improvements.push("Add frontend exposure"); }
  if (!hasDb) { improvements.push("Improve database knowledge"); }

  if (projects.length > 0 || (analysis.projects && analysis.projects.length > 0)) {
    strengths.push("Hands-on project experience");
    reasons.push("Projects available");
  } else {
    improvements.push("Add more technical projects to resume");
  }

  // Calculate score logic
  let score = 0;
  score += Math.min(allSkills.length * 4, 40); // Max 40 points from skills
  if (projects.length > 0 || (analysis.projects && analysis.projects.length > 0)) score += 30; // 30 points for projects
  if (hasFrontend && hasBackend) score += 20; // 20 points for fullstack
  if (experienceKeywords.length > 0) score += 10; // 10 points for experience

  let recommendation = "Needs Improvement";
  if (score >= 80) recommendation = "Strong Hire";
  else if (score >= 50) recommendation = "Consider";

  return {
    summary,
    strengths,
    improvements,
    recommendation,
    reasons,
    score
  };
};

const generateInterviewQuestions = (skills, jobRequirements = []) => {
  const allContext = [...skills, ...jobRequirements].map(s => s.toLowerCase());
  
  const questions = [];
  
  if (allContext.some(s => s.includes('react'))) {
    questions.push("Explain Virtual DOM and how React renders components.");
    questions.push("What is the difference between useEffect and useState?");
  }
  if (allContext.some(s => s.includes('node') || s.includes('express'))) {
    questions.push("Explain how middleware works in Express.js.");
    questions.push("How would you implement JWT authentication?");
  }
  if (allContext.some(s => s.includes('mongo') || s.includes('nosql'))) {
    questions.push("Explain the aggregation pipeline in MongoDB.");
    questions.push("What are the key differences between SQL and NoSQL databases?");
  }

  if (questions.length === 0) {
    questions.push("Explain your primary tech stack and why you chose it.");
    questions.push("How do you handle state management in your applications?");
  }

  // Add DSA
  questions.push("DSA: How would you reverse a linked list?");
  questions.push("DSA: Explain the time complexity of quicksort vs mergesort.");
  questions.push("DSA: Write an algorithm to find the longest substring without repeating characters.");

  // Add Project
  questions.push("Project: Describe the most challenging technical problem you solved in your projects.");
  questions.push("Project: How did you structure the architecture of your most recent application?");

  return questions;
};

const calculatePlacementReadiness = (student) => {
  const studentProfile = student.profile || {};
  const analysis = studentProfile.resumeAnalysis || {};
  const extractedSkills = analysis.extractedSkills || analysis.semanticAnalysis?.skills || [];
  const profileSkills = studentProfile.skills || [];
  const allSkills = [...new Set([...extractedSkills, ...profileSkills])];
  
  const manualProjects = studentProfile.projects || [];
  const extractedProjects = analysis.projects || [];
  const combinedProjectsCount = manualProjects.length + extractedProjects.length;

  // Resume Score
  let resumeScore = 0;
  if (analysis && analysis.extractedSkills && analysis.extractedSkills.length > 0) resumeScore = 100;
  else if (studentProfile.resumeUrl) resumeScore = 50;

  // Skill Score
  let skillScore = 0;
  if (allSkills.length >= 10) skillScore = 95;
  else if (allSkills.length >= 5) skillScore = 75;
  else if (allSkills.length > 0) skillScore = 45;

  // Project Score
  let projectScore = 0;
  if (combinedProjectsCount >= 3) projectScore = 95;
  else if (combinedProjectsCount >= 1) projectScore = 65;
  else projectScore = 20;

  const overallScore = Math.round((resumeScore * 0.4) + (skillScore * 0.3) + (projectScore * 0.3));

  return {
    resumeQuality: resumeScore,
    skillMatch: skillScore,
    projectStrength: projectScore,
    overallScore
  };
};

module.exports = {
  generateCandidateReport,
  generateInterviewQuestions,
  calculatePlacementReadiness
};
