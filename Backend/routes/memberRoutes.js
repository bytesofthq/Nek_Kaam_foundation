
const express = require('express');
const router = express.Router();
const { protect, adminOnly, protectMember } = require('../middleware/authMiddleware');
const {
  registerMember,
  loginMember,
  getMemberProfile,
  updateMemberProfile,
  getAllMembers,
  getMemberById,
  deleteMember,
  getMemberCount
} = require('../controllers/memberController');

router.post('/register', registerMember);
router.post('/login', loginMember);
router.get('/profile', protectMember, getMemberProfile);
router.put('/profile', protectMember, updateMemberProfile);

router.get('/', protect, adminOnly, getAllMembers);
router.get('/stats/count', getMemberCount);
router.get('/:id', protect, adminOnly, getMemberById);
router.delete('/:id', protect, adminOnly, deleteMember);

module.exports = router;