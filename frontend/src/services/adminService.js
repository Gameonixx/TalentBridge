import api from './api';

const API_URL = '/api/admin';

// Get admin stats
const getStats = async () => {
  const response = await api.get(`${API_URL}/stats`);
  console.log("Admin stats response", response.data);
  return response.data;
};

// Get all students for admin
const getStudents = async () => {
  const response = await api.get(`${API_URL}/students`);
  console.log("Admin students response", response.data);
  return response.data;
};

// Get all companies for admin
const getCompanies = async () => {
  const response = await api.get(`${API_URL}/companies`);
  console.log("Admin companies response", response.data);
  return response.data;
};

// Create a new announcement
const createAnnouncement = async (announcementData) => {
  const response = await api.post(`${API_URL}/announcements`, announcementData);
  return response.data;
};

const adminService = {
  getStats,
  getStudents,
  getCompanies,
  createAnnouncement,
};

export default adminService;
