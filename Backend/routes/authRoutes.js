
const express = require('express');
const router = express.Router();
const { protect, verifyMember, refreshAdminToken, refreshMemberToken } = require('../middleware/authMiddleware');
const {
  adminLogin,
  memberLogin,
  logout,
  verifyAdmin,
  verifyMember: verifyMemberController
} = require('../controllers/authController');

router.post('/admin/login', adminLogin);
router.post('/member/login', memberLogin);
router.post('/logout', logout);
router.get('/verify', protect, verifyAdmin);
router.get('/member/verify', verifyMember, verifyMemberController);

// Refresh token endpoints
router.post('/refresh-token', refreshAdminToken);
router.post('/member/refresh-token', refreshMemberToken);

module.exports = router;