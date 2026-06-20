const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  matchScore: {
    type: Number, // AI generated match score (0-100)
    default: null
  },
  matchInsights: {
    type: Object, // Stores detailed insights from AI
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
