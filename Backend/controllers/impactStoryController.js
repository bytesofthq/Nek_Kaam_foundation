
const ImpactStory = require('../models/ImpactStory');

const createStory = async (req, res) => {
  try {
    const story = await ImpactStory.create({
      ...req.body,
      addedBy: req.admin._id
    });
    res.status(201).json({ success: true, story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllStories = async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    const stories = await ImpactStory.find({ isApproved: true })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await ImpactStory.countDocuments({ isApproved: true });
    res.status(200).json({
      success: true,
      stories,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteStory = async (req, res) => {
  try {
    await ImpactStory.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createStory, getAllStories, deleteStory };