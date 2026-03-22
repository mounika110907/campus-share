const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addRating } = require('../controllers/ratingController');

router.post('/', auth, addRating);

module.exports = router;