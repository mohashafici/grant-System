const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { requireAdmin } = require('../middleware/authMiddleware');

router.get('/', announcementController.getAnnouncements);
router.post('/', requireAdmin, announcementController.createAnnouncement);
router.delete('/:id', requireAdmin, announcementController.deleteAnnouncement);

module.exports = router; 