
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

const {
  createActivity,
  getAllActivities,
  getFeaturedActivities,
  getActivityById,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');

router.post('/', protect, adminOnly, upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'video', maxCount: 1 }
]), createActivity);

router.get('/', getAllActivities);
router.get('/featured', getFeaturedActivities);
router.get('/:id', getActivityById);

router.put('/:id', protect, adminOnly, upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'video', maxCount: 1 }
]), updateActivity);

router.delete('/:id', protect, adminOnly, deleteActivity);

module.exports = router;