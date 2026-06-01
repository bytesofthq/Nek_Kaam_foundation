
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createActivity,
  getAllActivities,
  getFeaturedActivities,
  getActivityById,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');

router.post('/', protect, adminOnly, createActivity);
router.get('/', getAllActivities);
router.get('/featured', getFeaturedActivities);
router.get('/:id', getActivityById);
router.put('/:id', protect, adminOnly, updateActivity);
router.delete('/:id', protect, adminOnly, deleteActivity);

module.exports = router;