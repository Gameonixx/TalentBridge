const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAdminStats,
  getAdminStudents,
  getAdminCompanies,
  createAnnouncement
} = require('../controllers/adminController');

// All routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/students', getAdminStudents);
router.get('/companies', getAdminCompanies);
router.post('/announcements', createAnnouncement);

module.exports = router;
