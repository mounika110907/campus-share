const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  register,
  login,
  findUserByEmail
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/find-user', auth, findUserByEmail);

module.exports = router;