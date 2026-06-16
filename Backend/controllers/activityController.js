const Activity = require('../models/Activity');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (fileBuffer, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: 'nek_kaam_activities',
        resource_type: resourceType
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

const createActivity = async (req, res) => {
  try {
    const { title, description, location, date, isFeatured, project } = req.body;
    
    if (!title || !description || !location || !date || !project) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, description, location, date and project are required' 
      });
    }

    // Handle image uploads (min 1, max 3)
    const imageFiles = req.files?.images || [];
    if (imageFiles.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one photo is required' 
      });
    }
    if (imageFiles.length > 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'A maximum of 3 photos are allowed' 
      });
    }

    const images = [];
    for (const file of imageFiles) {
      const result = await uploadToCloudinary(file.buffer, 'image');
      images.push({
        url: result.secure_url,
        publicId: result.public_id
      });
    }

    // Handle optional video upload
    let video = undefined;
    const videoFiles = req.files?.video || [];
    if (videoFiles.length > 0 && videoFiles[0]) {
      const result = await uploadToCloudinary(videoFiles[0].buffer, 'video');
      video = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }
    
    const activity = await Activity.create({
      title,
      description,
      images,
      video,
      project,
      location,
      date,
      isFeatured: isFeatured === 'true' || isFeatured === true,
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
      .populate('addedBy', 'name')
      .populate('project', 'title');
    
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
      .populate('addedBy', 'name')
      .populate('project', 'title');
    
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
      .populate('addedBy', 'name')
      .populate('project', 'title');
    
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
    const { title, description, location, date, isFeatured, project } = req.body;
    
    let updateData = { 
      title, 
      description, 
      location, 
      date, 
      isFeatured: isFeatured === 'true' || isFeatured === true, 
      project 
    };

    // Handle optional image uploads
    const imageFiles = req.files?.images || [];
    if (imageFiles.length > 0) {
      if (imageFiles.length > 3) {
        return res.status(400).json({ 
          success: false, 
          message: 'A maximum of 3 photos are allowed' 
        });
      }
      const images = [];
      for (const file of imageFiles) {
        const result = await uploadToCloudinary(file.buffer, 'image');
        images.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
      updateData.images = images;
    }

    // Handle optional video upload
    const videoFiles = req.files?.video || [];
    if (videoFiles.length > 0 && videoFiles[0]) {
      const result = await uploadToCloudinary(videoFiles[0].buffer, 'video');
      updateData.video = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      updateData,
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