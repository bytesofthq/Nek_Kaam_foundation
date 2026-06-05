
const express = require('express');
const router = express.Router();
const { protect, refreshAdminToken } = require('../middleware/authMiddleware');
const {
  adminRegister,
  adminLogin,
  logout,
  verifyAdmin
} = require('../controllers/authController');


router.post('/admin/register', adminRegister);
router.post('/admin/login', adminLogin);
router.post('/logout', logout);
router.get('/verify', protect, verifyAdmin);

// Refresh token endpoints
router.post('/refresh-token', refreshAdminToken);

module.exports = router;