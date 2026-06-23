import api from './api';

const API_URL = '/api/announcements';

// Get all announcements
const getAnnouncements = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

const announcementService = {
  getAnnouncements,
};

export default announcementService;
