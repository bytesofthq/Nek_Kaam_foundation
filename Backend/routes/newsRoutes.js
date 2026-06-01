
const express = require('express');
const router = express.Router();
const NewsUpdate = require('../models/NewsUpdate');
const { protect, adminOnly } = require('../middleware/authMiddleware');


router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const news = await NewsUpdate.create({
      ...req.body,
      addedBy: req.admin._id
    });
    res.status(201).json({ success: true, news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    let filter = { isActive: true };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    const news = await NewsUpdate.find(filter)
      .sort({ publishedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await NewsUpdate.countDocuments(filter);
    
    res.json({
      success: true,
      news,
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


router.get('/latest', async (req, res) => {
  try {
    const news = await NewsUpdate.find({ isActive: true })
      .sort({ publishedDate: -1 })
      .limit(5);
    
    res.json({ success: true, news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/important', async (req, res) => {
  try {
    const news = await NewsUpdate.find({ isActive: true, isImportant: true })
      .sort({ publishedDate: -1 })
      .limit(3);
    
    res.json({ success: true, news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const news = await NewsUpdate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await NewsUpdate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;