
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  registerMember,
  getAllMembers,
  getMemberById,
  deleteMember,
  getMemberCount
} = require('../controllers/memberController');

router.post('/register', registerMember);
router.get('/', protect, adminOnly, getAllMembers);
router.get('/stats/count', getMemberCount);
router.get('/:id', protect, adminOnly, getMemberById);
router.delete('/:id', protect, adminOnly, deleteMember);

module.exports = router;