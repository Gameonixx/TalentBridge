const normalizeSkill = (skill) => {
  let s = skill.toLowerCase().trim();
  if (s === 'react.js') return 'react';
  if (s === 'node.js') return 'node';
  if (s === 'vue.js') return 'vue';
  if (s === 'angular.js' || s === 'angularjs') return 'angular';
  return s;
};

const calculateMatchScore = (profile, resumeAnalysis, jobRequirements) => {
  let score = 0;
  const matchedSkills = [];
  const missingSkills = [];
  const reasons = [];

  const safeProfile = profile || {};
  const analysis = resumeAnalysis || {};
  const semantic = analysis.semanticAnalysis || { skills: [], domains: [], projectCategories: [], experienceLevel: "Entry Level", strengths: [] };
  const reqs = jobRequirements || [];

  // 1. Skill Match (60%)
  const studentSkillsRaw = [
    ...(safeProfile.skills || []),
    ...(analysis.extractedSkills || []),
    ...(semantic.skills || [])
  ];
  
  const candidateSkills = Array.from(new Set(studentSkillsRaw.map(normalizeSkill)));
  
  if (reqs.length > 0) {
    let matchCount = 0;
    reqs.forEach((reqSkill) => {
      const normalizedReq = normalizeSkill(reqSkill);
      const isMatch = candidateSkills.some(s => s.includes(normalizedReq) || normalizedReq.includes(s));

      if (isMatch) {
        matchCount++;
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });
    score += (matchCount / reqs.length) * 60;
  } else {
    score += 60;
  }

  if (matchedSkills.length > 0) {
    reasons.push(`Strong skill match (${matchedSkills.slice(0, 3).join(', ')})`);
  }

  // 2. Project Relevance (20%)
  const candidateDomains = semantic.domains || [];
  let domainScore = 0;
  let matchedDomain = null;
  
  const hasFrontend = candidateDomains.includes('Frontend');
  const hasBackend = candidateDomains.includes('Backend');
  const hasCloud = candidateDomains.includes('Cloud/DevOps');
  const hasAI = candidateDomains.includes('AI/ML');
  
  if (hasFrontend) {
    domainScore += 20;
    matchedDomain = 'Frontend';
  } else if (hasBackend) {
    domainScore += 20;
    matchedDomain = 'Backend';
  } else if (hasCloud) {
    domainScore += 20;
    matchedDomain = 'Cloud';
  } else if (hasAI) {
    domainScore += 20;
    matchedDomain = 'AI/ML';
  } else {
    if (semantic.projectCategories && semantic.projectCategories.includes('Complex/Production-grade Systems')) {
      domainScore += 15;
      reasons.push('Experience with complex architectures');
    } else if (candidateDomains.length > 0) {
      domainScore += 10;
    } else {
      domainScore += 5;
    }
  }
  score += domainScore;
  if (matchedDomain) {
    reasons.push(`Relevant ${matchedDomain} projects`);
  }

  // 3. Experience Indicators (10%)
  let expScore = 0;
  const expLvl = semantic.experienceLevel || "Entry Level";
  
  if (expLvl === 'Senior Level') expScore = 10;
  else if (expLvl === 'Mid Level') expScore = 8;
  else expScore = 5; // Entry Level
  
  score += expScore;

  if (semantic.strengths && semantic.strengths.includes('Cloud exposure detected')) {
    reasons.push('Cloud exposure');
  }

  // 4. Academic Score (10%)
  let academicScore = 0;
  const cgpa = safeProfile.cgpa ? parseFloat(safeProfile.cgpa) : 0;
  if (cgpa >= 9.0) academicScore = 10;
  else if (cgpa >= 8.0) academicScore = 8;
  else if (cgpa >= 7.0) academicScore = 5;
  else if (cgpa > 0) academicScore = 3;
  else academicScore = 5; // Default if not provided
  
  score += academicScore;
  if (academicScore >= 8) {
    reasons.push('Strong academic background');
  }

  if (reasons.length === 0) {
    reasons.push('Basic requirements met');
  }

  score = Math.min(Math.round(score), 100);

  let level = 'Low Match';
  if (score >= 80) level = 'Strong Match';
  else if (score >= 50) level = 'Good Match';

  return {
    score,
    level,
    matchedSkills: [...new Set(matchedSkills)],
    missingSkills: [...new Set(missingSkills)],
    reasons: [...new Set(reasons)].slice(0, 4)
  };
};

module.exports = {
  calculateMatchScore
};
