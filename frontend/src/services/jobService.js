import api from './api';

const jobService = {
  // Get all jobs (will be filtered by backend based on user role)
  getJobs: async () => {
    const response = await api.get('/api/jobs');
    return response.data;
  },

  // Get single job by ID
  getJobById: async (jobId) => {
    const response = await api.get(`/api/jobs/${jobId}`);
    return response.data;
  },

  // Create a new job (Recruiter only)
  createJob: async (jobData) => {
    const response = await api.post('/api/jobs', jobData);
    return response.data;
  },

  // Update a job (Recruiter/Admin only)
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/api/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Delete a job (Recruiter/Admin only)
  deleteJob: async (jobId) => {
    const response = await api.delete(`/api/jobs/${jobId}`);
    return response.data;
  }
};

export default jobService;
