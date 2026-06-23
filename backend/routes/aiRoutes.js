const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getStudentIntelligence, getInterviewQuestions } = require('../controllers/aiController');

// All routes are protected
router.use(protect);

router.get('/candidate/:studentId', getStudentIntelligence);
router.get('/candidate/:studentId/interview', getInterviewQuestions);

module.exports = router;
