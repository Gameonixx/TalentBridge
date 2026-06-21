const normalizeSkill = (skill) => {
  let s = skill.toLowerCase().trim();
  if (s === 'react.js') return 'react';
  if (s === 'node.js') return 'node';
  if (s === 'vue.js') return 'vue';
  if (s === 'angular.js' || s === 'angularjs') return 'angular';
  return s;
};

const calculateMatchScore = (studentProfile, job, resumeAnalysis) => {
  let score = 0;
  const matchedSkills = [];
  const missingSkills = [];
  const suggestions = [];

  const profile = studentProfile || {};
  const analysis = resumeAnalysis || {};
  const jobRequirements = job.requirements || [];

  // Combine student skills and resume extracted skills
  const studentSkillsRaw = [
    ...(profile.skills || []),
    ...(analysis.extractedSkills || [])
  ];
  
  // Normalize skills
  const candidateSkills = Array.from(new Set(studentSkillsRaw.map(normalizeSkill)));
  
  // 1. Skill Compatibility (70%)
  if (jobRequirements.length > 0) {
    let matchCount = 0;

    jobRequirements.forEach((reqSkill) => {
      const normalizedReq = normalizeSkill(reqSkill);
      const isMatch = candidateSkills.some(s => s.includes(normalizedReq) || normalizedReq.includes(s));

      if (isMatch) {
        matchCount++;
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    score += (matchCount / jobRequirements.length) * 70;
  } else {
    // If no requirements, full score
    score += 70;
  }

  // 2. Technology Similarity (20%)
  // Compare analysis.technologies against job requirements
  const candidateTechs = Array.from(new Set([
    ...(analysis.technologies || []).map(t => t.toLowerCase().trim())
  ]));

  if (jobRequirements.length > 0 && candidateTechs.length > 0) {
    let techMatchCount = 0;
    
    jobRequirements.forEach(reqSkill => {
      const normalizedReq = normalizeSkill(reqSkill);
      // Determine tech category of requirement loosely
      let reqTechCategory = null;
      if (['react', 'html', 'css', 'javascript', 'tailwind', 'vue', 'angular'].includes(normalizedReq)) reqTechCategory = 'frontend';
      if (['node', 'express', 'mongodb', 'sql', 'postgresql', 'mysql', 'django', 'flask', 'java', 'spring'].includes(normalizedReq)) reqTechCategory = 'backend';
      if (['python', 'ml', 'tensorflow', 'machine learning', 'data science'].includes(normalizedReq)) reqTechCategory = 'ai/ml';
      
      if (reqTechCategory && candidateTechs.includes(reqTechCategory)) {
        techMatchCount++;
      }
    });

    // If there's any matching technology overlap, give score based on matching ratio, or just give 20% if any match
    // Let's do a proportional match based on total requirements, capped at 20.
    // If they have matching tech categories for at least some of the requirements
    const techScore = (techMatchCount / jobRequirements.length) * 20;
    // To be generous, if they have the exact tech, or the category matches:
    // If candidateTechs length > 0 we can give a base score + proportional
    score += Math.max(techScore, candidateTechs.length > 0 ? 10 : 0);
  } else if (candidateTechs.length > 0) {
    score += 20; // Has tech, no requirements to check against
  } else {
    suggestions.push('Add specific technologies (e.g. React, Node, Python) to your profile/resume to improve tech match.');
  }

  // Cap score to ensure it doesn't exceed 90 before completeness
  score = Math.min(score, 90);

  // 3. Profile Completeness (10%)
  let completenessScore = 0;
  if (profile.githubUrl) completenessScore += 3;
  if (profile.linkedinUrl) completenessScore += 3;
  if (profile.resumeUrl) completenessScore += 2;
  if (profile.experience && profile.experience.length > 0) completenessScore += 2;
  else if (analysis.experienceKeywords && analysis.experienceKeywords.length > 0) completenessScore += 2;
  else if (analysis.projects && analysis.projects.length > 0) completenessScore += 2; // fallback

  score += completenessScore;

  if (completenessScore < 10) {
    suggestions.push('Complete your profile with GitHub, LinkedIn, and resume links for a perfect score.');
  }

  if (missingSkills.length > 0) {
    suggestions.push(`Learn ${missingSkills.slice(0, 2).join(' and ')} to improve compatibility.`);
  }

  let recommendation = 'Low Match';
  if (score >= 80) recommendation = 'Strong Match';
  else if (score >= 50) recommendation = 'Moderate Match';

  return {
    matchScore: Math.round(score),
    matchedSkills: [...new Set(matchedSkills)],
    missingSkills: [...new Set(missingSkills)],
    resumeInsights: {
      technologies: candidateTechs,
      recommendation
    },
    suggestions: [...new Set(suggestions)],
  };
};

module.exports = {
  calculateMatchScore
};
