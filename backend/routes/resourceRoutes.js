const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
  addResource,
  getResources,
  getMyResources,
  updateResource,
  deleteResource
} = require('../controllers/resourceController');

router.get('/', getResources);
router.get('/mine', auth, getMyResources);
router.post('/', auth, addResource);
router.put('/:id', auth, updateResource);
router.delete('/:id', auth, deleteResource);

module.exports = router;