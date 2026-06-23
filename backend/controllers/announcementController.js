const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });
    
    res.status(200).json(announcements);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnnouncements
};
