import api from './api';

const applicationService = {
  applyToJob: async (jobId) => {
    const response = await api.post(`/api/applications/${jobId}`);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/api/applications/my');
    return response.data;
  }
};

export default applicationService;
