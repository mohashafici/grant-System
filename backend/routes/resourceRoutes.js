const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', resourceController.getAllResources);
router.post('/', auth, authorizeRoles('admin'), resourceController.createResource);
router.delete('/:id', auth, authorizeRoles('admin'), resourceController.deleteResource);

module.exports = router; 