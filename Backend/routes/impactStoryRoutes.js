
const express = require('express');
const router = express.Router();
const ImpactStory = require('../models/ImpactStory');
const { protect, adminOnly } = require('../middleware/authMiddleware');


router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const story = await ImpactStory.create({
      ...req.body,
      addedBy: req.admin._id
    });
    res.status(201).json({ success: true, story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    
    const stories = await ImpactStory.find({ isApproved: true })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await ImpactStory.countDocuments({ isApproved: true });
    
    res.json({
      success: true,
      stories,
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


router.get('/featured', async (req, res) => {
  try {
    const stories = await ImpactStory.find({ isApproved: true })
      .sort({ date: -1 })
      .limit(3);
    
    res.json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const story = await ImpactStory.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    res.json({ success: true, story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const story = await ImpactStory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({ success: true, story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await ImpactStory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;