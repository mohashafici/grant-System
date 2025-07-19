const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.get('/', communityController.getThreads);
router.get('/:id', communityController.getThread);
router.post('/', communityController.createThread);
router.post('/:id/reply', communityController.addReply);

module.exports = router; 