
const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Initialize default settings if not exist
const initSettings = async () => {
  const defaultSettings = Setting.getDefaultSettings();
  for (const [key, value] of Object.entries(defaultSettings)) {
    const exists = await Setting.findOne({ key });
    if (!exists) {
      await Setting.create({ key, value, category: 'General' });
    }
  }
};
initSettings();

// @route   GET /api/settings
// @desc    Get all settings (Public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    res.json({ success: true, settings: settingsObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/settings
// @desc    Update settings (Admin only)
// @access  Private/Admin
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const updates = req.body;
    
    for (const [key, value] of Object.entries(updates)) {
      await Setting.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      );
    }
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/settings/visitor-count/increment
// @desc    Increment visitor count
// @access  Public
router.post('/visitor-count/increment', async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: 'visitorCount' });
    if (!setting) {
      setting = await Setting.create({ key: 'visitorCount', value: 0, category: 'General' });
    }
    setting.value += 1;
    await setting.save();
    
    res.json({ success: true, count: setting.value });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;