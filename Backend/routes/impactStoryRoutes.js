
const express = require('express');
const router = express.Router();
const ImpactStory = require('../models/ImpactStory');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'nek_kaam_impact_stories' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    let images = [];
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      images.push({
        url: result.secure_url,
        publicId: result.public_id
      });
    }

    const story = await ImpactStory.create({
      ...req.body,
      images,
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


router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.images = [{
        url: result.secure_url,
        publicId: result.public_id
      }];
    }

    const story = await ImpactStory.findByIdAndUpdate(
      req.params.id,
      updateData,
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