
const Activity = require('../models/Activity');

const createActivity = async (req, res) => {
  try {
    const { title, description, images, location, date, isFeatured } = req.body;
    
    if (!title || !description || !location || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, description, location and date are required' 
      });
    }
    
    const activity = await Activity.create({
      title,
      description,
      images,
      location,
      date,
      isFeatured: isFeatured || false,
      addedBy: req.admin._id
    });
    
    res.status(201).json({ 
      success: true, 
      activity 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getAllActivities = async (req, res) => {
  try {
    const { page = 1, limit = 9, year } = req.query;
    let filter = {};
    
    if (year) {
      filter.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }
    
    const activities = await Activity.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('addedBy', 'name');
    
    const total = await Activity.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getFeaturedActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ isFeatured: true })
      .sort({ date: -1 })
      .limit(6)
      .populate('addedBy', 'name');
    
    res.status(200).json({ 
      success: true, 
      activities 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('addedBy', 'name');
    
    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      activity 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      activity 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Activity deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  createActivity,
  getAllActivities,
  getFeaturedActivities,
  getActivityById,
  updateActivity,
  deleteActivity
};