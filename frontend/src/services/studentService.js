import api from './api';

const studentService = {
  getProfile: async () => {
    const response = await api.get('/api/student/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/api/student/profile', profileData);
    return response.data;
  }
};

export default studentService;
