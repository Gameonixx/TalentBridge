// Mock Resume Parser Service
class ResumeParserService {
  /**
   * Mock parser that simulates extracting data from a resume file.
   * To be replaced with real AI integration later.
   * @param {File|string} resume - The resume file or text content.
   * @returns {Promise<Object>} Extracted candidate data.
   */
  async parseResume(resume) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      name: "Mock Candidate",
      email: "mock.candidate@example.com",
      skills: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
      experienceYears: 2,
      education: "University of Mock",
    };
  }
}

module.exports = new ResumeParserService();
