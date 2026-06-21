const calculateMatchScore = (studentProfile, job) => {
  let score = 0;
  const matchedSkills = [];
  const missingSkills = [];
  const suggestions = [];

  const profile = studentProfile || {};
  const jobRequirements = job.requirements || [];

  // 1. Skills match (70%)
  if (jobRequirements.length > 0) {
    const studentSkills = (profile.skills || []).map((s) => s.toLowerCase().trim());
    let matchCount = 0;

    jobRequirements.forEach((reqSkill) => {
      const skillLower = reqSkill.toLowerCase().trim();
      const isMatch = studentSkills.some(
        (s) => s.includes(skillLower) || skillLower.includes(s)
      );

      if (isMatch) {
        matchCount++;
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    score += (matchCount / jobRequirements.length) * 70;
  } else {
    // If no requirements, grant full skills score
    score += 70;
  }

  // 2. CGPA eligibility (20%)
  const jobCgpa = job.cgpaCriteria || 0;
  const studentCgpa = profile.cgpa || 0;

  if (jobCgpa === 0) {
    score += 20;
  } else if (studentCgpa >= jobCgpa) {
    score += 20;
  } else {
    // Partial score if slightly below
    const diff = jobCgpa - studentCgpa;
    if (diff <= 1.0) {
      score += 10;
      suggestions.push('Improve CGPA to meet job criteria');
    } else {
      suggestions.push('CGPA is below the requirement');
    }
  }

  // 3. Profile completeness (10%)
  let completenessScore = 0;
  if (profile.resumeUrl) completenessScore += 2;
  if (profile.githubUrl) completenessScore += 2;
  if (profile.linkedinUrl) completenessScore += 2;
  if (profile.projects && profile.projects.length > 0) completenessScore += 2;
  if (profile.experience && profile.experience.length > 0) completenessScore += 2;

  score += completenessScore;

  if (completenessScore < 10) {
    if (!profile.projects || profile.projects.length === 0) {
      suggestions.push('Add more backend/frontend projects');
    }
    if (!profile.resumeUrl || !profile.githubUrl || !profile.linkedinUrl) {
      suggestions.push('Complete your profile with resume, GitHub, and LinkedIn links');
    }
  }

  if (missingSkills.length > 0) {
    suggestions.push(
      `Learn ${missingSkills.slice(0, 2).join(' and ')} to improve compatibility`
    );
  }

  return {
    matchScore: Math.round(score),
    matchedSkills: [...new Set(matchedSkills)],
    missingSkills: [...new Set(missingSkills)],
    suggestions: [...new Set(suggestions)],
  };
};

module.exports = {
  calculateMatchScore,
};
