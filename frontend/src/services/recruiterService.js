import api from './api';

const recruiterService = {
  getDashboardStats: async () => {
    const response = await api.get('/api/recruiter/dashboard');
    return response.data;
  },

  getJobApplicants: async (jobId) => {
    const response = await api.get(`/api/recruiter/jobs/${jobId}/applicants`);
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.put(`/api/recruiter/applications/${applicationId}/status`, { status });
    return response.data;
  }
};

export default recruiterService;
