const analyzeResumeSemantics = (text) => {
  const textLower = text.toLowerCase();
  
  const skills = [];
  const domains = [];
  const projectCategories = [];
  const strengths = [];
  let experienceLevel = "Entry Level";
  let score = 0;

  // Domain detection
  if (textLower.includes('frontend') || textLower.includes('ui/ux') || textLower.includes('react') || textLower.includes('vue') || textLower.includes('angular')) {
    domains.push('Frontend');
  }
  if (textLower.includes('backend') || textLower.includes('api') || textLower.includes('node') || textLower.includes('express') || textLower.includes('django') || textLower.includes('spring')) {
    domains.push('Backend');
  }
  if (textLower.includes('fullstack') || textLower.includes('full-stack') || textLower.includes('full stack')) {
    domains.push('Full Stack');
  }
  if (textLower.includes('cloud') || textLower.includes('aws') || textLower.includes('azure') || textLower.includes('gcp') || textLower.includes('docker') || textLower.includes('kubernetes')) {
    domains.push('Cloud/DevOps');
  }
  if (textLower.includes('machine learning') || textLower.includes('ai') || textLower.includes('data science') || textLower.includes('tensorflow') || textLower.includes('pytorch')) {
    domains.push('AI/ML');
  }
  if (textLower.includes('mobile') || textLower.includes('android') || textLower.includes('ios') || textLower.includes('react native') || textLower.includes('flutter')) {
    domains.push('Mobile Development');
  }

  // Skills & Tools detection (Adding a few explicitly semantic ones)
  const allFrameworks = ['react', 'node.js', 'vue.js', 'angular', 'django', 'flask', 'spring boot', 'express', 'next.js', 'kubernetes', 'docker'];
  allFrameworks.forEach(fw => {
    if (textLower.includes(fw)) skills.push(fw);
  });
  
  const allLangs = ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'typescript', 'sql', 'php'];
  allLangs.forEach(lang => {
    if (textLower.includes(lang)) skills.push(lang);
  });

  const allDbs = ['mongodb', 'mysql', 'postgresql', 'redis', 'firebase', 'oracle'];
  allDbs.forEach(db => {
    if (textLower.includes(db)) skills.push(db);
  });

  // Project Complexity detection
  if (textLower.includes('microservices') || textLower.includes('architecture') || textLower.includes('scalable') || textLower.includes('production') || textLower.includes('deployment')) {
    projectCategories.push('Complex/Production-grade Systems');
  } else if (textLower.includes('project') || textLower.includes('app') || textLower.includes('clone') || textLower.includes('dashboard')) {
    projectCategories.push('Standard Projects');
  }

  // Experience level detection
  if (textLower.includes('senior') || textLower.includes('lead') || textLower.includes('architect') || textLower.match(/[5-9]\+?\s*(years|yrs)/) || textLower.match(/1[0-9]\+?\s*(years|yrs)/)) {
    experienceLevel = "Senior Level";
    score += 40;
  } else if (textLower.includes('mid') || textLower.includes('intermediate') || textLower.match(/[2-4]\+?\s*(years|yrs)/)) {
    experienceLevel = "Mid Level";
    score += 25;
  } else if (textLower.includes('intern') || textLower.includes('junior') || textLower.match(/[0-1]\+?\s*(years|yrs)/)) {
    experienceLevel = "Entry Level";
    score += 10;
  } else {
    // Default fallback if no years/titles explicitly mentioned
    score += 10; 
  }

  // Strengths detection based on findings
  if (domains.includes('Backend') && domains.includes('Frontend')) strengths.push('Full Stack capability');
  if (domains.includes('Cloud/DevOps')) strengths.push('Cloud exposure detected');
  if (projectCategories.includes('Complex/Production-grade Systems')) strengths.push('Experience with complex architectures');
  if (skills.length > 5) strengths.push('Diverse technical toolkit');

  return {
    skills: [...new Set(skills)],
    domains: [...new Set(domains)],
    projectCategories: [...new Set(projectCategories)],
    experienceLevel,
    strengths: [...new Set(strengths)],
    score
  };
};

module.exports = { analyzeResumeSemantics };
