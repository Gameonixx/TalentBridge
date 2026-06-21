const normalizeSkill = (skill) => {
  let s = skill.toLowerCase().trim();
  if (s === 'react.js') return 'react';
  if (s === 'node.js') return 'node';
  if (s === 'vue.js') return 'vue';
  if (s === 'angular.js' || s === 'angularjs') return 'angular';
  return s;
};

const calculateMatchScore = (studentProfile, job, resumeAnalysis) => {
  let percentage = 0;
  const matchedSkills = [];
  const missingSkills = [];
  const reasons = [];

  const profile = studentProfile || {};
  const analysis = resumeAnalysis || {};
  const semantic = analysis.semanticAnalysis || { skills: [], domains: [], projectCategories: [], experienceLevel: "Entry Level", strengths: [] };
  const jobRequirements = job.requirements || [];

  // 1. Skill Similarity (60%)
  const studentSkillsRaw = [
    ...(profile.skills || []),
    ...(analysis.extractedSkills || []),
    ...(semantic.skills || [])
  ];
  
  const candidateSkills = Array.from(new Set(studentSkillsRaw.map(normalizeSkill)));
  
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

    percentage += (matchCount / jobRequirements.length) * 60;
  } else {
    percentage += 60;
  }

  // Generate reasons from matched skills
  if (matchedSkills.length > 0) {
    reasons.push(`${matchedSkills.slice(0, 3).join(', ')} experience`);
  }

  // 2. Project/Domain Relevance (25%)
  // Simple heuristic: if domains are mentioned in job, match them, else fallback to candidate tech or general score
  const candidateDomains = semantic.domains || [];
  let domainScore = 0;
  
  const jobText = (job.title + " " + job.description + " " + jobRequirements.join(" ")).toLowerCase();
  let matchedDomain = null;
  
  if (candidateDomains.includes('Frontend') && (jobText.includes('frontend') || jobText.includes('ui') || jobText.includes('react'))) {
    domainScore += 25;
    matchedDomain = 'Frontend';
  } else if (candidateDomains.includes('Backend') && (jobText.includes('backend') || jobText.includes('api') || jobText.includes('node'))) {
    domainScore += 25;
    matchedDomain = 'Backend';
  } else if (candidateDomains.includes('Cloud/DevOps') && (jobText.includes('cloud') || jobText.includes('aws') || jobText.includes('devops'))) {
    domainScore += 25;
    matchedDomain = 'Cloud';
  } else if (candidateDomains.includes('AI/ML') && (jobText.includes('ai') || jobText.includes('machine learning') || jobText.includes('data'))) {
    domainScore += 25;
    matchedDomain = 'AI/ML';
  } else {
    // If no specific domain matches, give partial score based on complexity or general tech presence
    if (semantic.projectCategories && semantic.projectCategories.includes('Complex/Production-grade Systems')) {
      domainScore += 20;
      reasons.push('Experience with complex architectures');
    } else if (candidateDomains.length > 0) {
      domainScore += 15;
    } else {
      domainScore += 5; // Base score
    }
  }

  percentage += domainScore;
  if (matchedDomain) {
    reasons.push(`${matchedDomain} projects detected`);
  } else if (semantic.strengths && semantic.strengths.includes('Cloud exposure detected')) {
    reasons.push('Cloud exposure');
  } else if (analysis.projects && analysis.projects.length > 0) {
    reasons.push('Relevant project work detected');
  }

  // 3. Experience Relevance (15%)
  let expScore = 0;
  const expLvl = semantic.experienceLevel || "Entry Level";
  
  if (jobText.includes('senior') || jobText.includes('lead') || jobText.match(/[5-9] years/)) {
    if (expLvl === 'Senior Level') expScore = 15;
    else if (expLvl === 'Mid Level') expScore = 7;
    else expScore = 0;
  } else if (jobText.includes('mid') || jobText.match(/[2-4] years/)) {
    if (expLvl === 'Senior Level' || expLvl === 'Mid Level') expScore = 15;
    else expScore = 8;
  } else {
    // Entry level job or unspecified
    expScore = 15; // Assume entry level fits or unspecified allows anything
  }
  
  percentage += expScore;

  if (semantic.strengths && semantic.strengths.length > 0) {
    // Add additional unique strengths as reasons
    semantic.strengths.forEach(s => {
      if (!reasons.includes(s) && !reasons.some(r => r.includes(s.split(' ')[0]))) {
        reasons.push(s);
      }
    });
  }

  // Add default missing skill reason if applicable
  if (missingSkills.length > 0 && reasons.length < 3) {
    // We don't add missing skills as a 'reason' here because UI handles Missing separately,
    // but we can ensure reasons has something
    if (reasons.length === 0) reasons.push('Basic criteria met');
  } else if (reasons.length === 0) {
    reasons.push('Strong foundational fit');
  }

  percentage = Math.min(Math.round(percentage), 100);

  let level = 'Low Match';
  if (percentage >= 80) level = 'Strong Match';
  else if (percentage >= 50) level = 'Moderate Match';

  return {
    percentage,
    level,
    matchedSkills: [...new Set(matchedSkills)],
    missingSkills: [...new Set(missingSkills)],
    reasons: [...new Set(reasons)].slice(0, 4) // Keep top 4 reasons
  };
};

module.exports = {
  calculateMatchScore
};
