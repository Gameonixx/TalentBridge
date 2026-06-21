const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadResume } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for memory storage to parse PDF directly
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

router.route('/profile')
  .get(protect, authorize('student'), getProfile)
  .put(protect, authorize('student'), updateProfile);

router.post('/resume', protect, authorize('student'), upload.single('resume'), uploadResume);

module.exports = router;
