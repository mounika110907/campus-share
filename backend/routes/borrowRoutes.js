const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
  createBorrowRequest,
  getIncomingRequests,
  getMyBorrowedRequests,
  updateBorrowStatus
} = require('../controllers/borrowController');

router.post('/', auth, createBorrowRequest);
router.get('/incoming', auth, getIncomingRequests);
router.get('/mine', auth, getMyBorrowedRequests);
router.put('/:id/status', auth, updateBorrowStatus);

module.exports = router;