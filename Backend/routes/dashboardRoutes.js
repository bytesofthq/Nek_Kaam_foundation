
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getMonthlyFundData,
  getMemberGrowth,
  getRecentActivities,
  getCategoryWiseUsage
} = require('../controllers/dashboardController');

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/charts/monthly-funds', protect, adminOnly, getMonthlyFundData);
router.get('/charts/member-growth', protect, adminOnly, getMemberGrowth);
router.get('/charts/category-usage', protect, adminOnly, getCategoryWiseUsage);
router.get('/recent-activities', protect, adminOnly, getRecentActivities);

module.exports = router;