// Mock Candidate Match Service
class CandidateMatchService {
  /**
   * Mock service that simulates generating a match score between a candidate and a job.
   * To be replaced with real AI integration later.
   * @param {Object} candidate - Candidate details (e.g. from resume parser).
   * @param {Object} job - Job posting details.
   * @returns {Promise<Object>} Match score and insights.
   */
  async calculateMatchScore(candidate, job) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      score: 85, // Percentage match
      matchedSkills: ["React", "Node.js"],
      missingSkills: ["AWS"],
      recommendation: "Strong match for frontend and backend skills, but lacks cloud experience.",
    };
  }
}

module.exports = new CandidateMatchService();
