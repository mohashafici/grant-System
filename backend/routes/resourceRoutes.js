const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { requireAdmin } = require('../middleware/authMiddleware');

router.get('/', resourceController.getAllResources);
router.post('/', requireAdmin, resourceController.createResource);
router.delete('/:id', requireAdmin, resourceController.deleteResource);

module.exports = router; 