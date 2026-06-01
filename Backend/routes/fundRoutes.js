
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  addFundCollection,
  getFundCollections,
  getTotalFundCollections,
  deleteFundCollection,
  addFundUsage,
  getFundUsages,
  getTotalFundUsage,
  getFundSummary,
  deleteFundUsage
} = require('../controllers/fundController');

// Fund Collection routes
router.post('/collections', protect, adminOnly, addFundCollection);
router.get('/collections', getFundCollections);
router.get('/collections/total', getTotalFundCollections);
router.delete('/collections/:id', protect, adminOnly, deleteFundCollection);

// Fund Usage routes
router.post('/usages', protect, adminOnly, addFundUsage);
router.get('/usages', getFundUsages);
router.get('/usages/total', getTotalFundUsage);
router.delete('/usages/:id', protect, adminOnly, deleteFundUsage);

// Summary route
router.get('/summary', getFundSummary);

module.exports = router;