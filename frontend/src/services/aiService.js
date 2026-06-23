import api from './api';

const API_URL = '/api/ai';

const getStudentIntelligence = async (studentId) => {
  const response = await api.get(`${API_URL}/candidate/${studentId}`);
  return response.data;
};

const getInterviewQuestions = async (studentId, jobId) => {
  let url = `${API_URL}/candidate/${studentId}/interview`;
  if (jobId) {
    url += `?jobId=${jobId}`;
  }
  const response = await api.get(url);
  return response.data;
};

const aiService = {
  getStudentIntelligence,
  getInterviewQuestions
};

export default aiService;
