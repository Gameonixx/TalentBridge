const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadResume } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'));
    }
  }
});

router.route('/profile')
  .get(protect, authorize('student'), getProfile)
  .put(protect, authorize('student'), updateProfile);

router.post('/resume', protect, authorize('student'), upload.single('resume'), uploadResume);

module.exports = router;
