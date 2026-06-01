
const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect, adminOnly } = require('../middleware/authMiddleware');


router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .sort({ order: 1, createdAt: -1 });
    
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;