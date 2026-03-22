const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/chatController');

router.post('/', auth, sendMessage);
router.get('/:userId', auth, getMessages);

module.exports = router;