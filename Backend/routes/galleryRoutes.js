
const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect, adminOnly } = require('../middleware/authMiddleware');


router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const image = await Gallery.create({
      ...req.body,
      addedBy: req.admin._id
    });
    res.status(201).json({ success: true, image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    const images = await Gallery.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Gallery.countDocuments(filter);
    
    res.json({
      success: true,
      images,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/categories', async (req, res) => {
  try {
    const categories = await Gallery.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery image
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;