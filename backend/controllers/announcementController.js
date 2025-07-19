const Announcement = require('../models/Announcement');

// Get all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ pinned: -1, date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create announcement (admin only)
exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// Delete announcement (admin only)
exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
}; 