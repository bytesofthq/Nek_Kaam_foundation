const Gallery = require('../models/Gallery');

const createGalleryImage = async (req, res) => {
  try {
    const { title, category, description, location, image, isFeatured } = req.body;

    if (!title || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Title, category and image are required'
      });
    }

    const gallery = await Gallery.create({
      title,
      category,
      description,
      location,
      image,
      isFeatured: isFeatured || false,
      addedBy: req.admin._id
    });

    res.status(201).json({
      success: true,
      gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getGalleryByCategory = async (req, res) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    let filter = { isFeatured: false };

    if (category) {
      filter.category = category;
    }

    const gallery = await Gallery.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('addedBy', 'name');

    const total = await Gallery.countDocuments(filter);

    res.status(200).json({
      success: true,
      gallery,
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

const getFeaturedGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find({ isFeatured: true })
      .sort({ date: -1 })
      .limit(6)
      .populate('addedBy', 'name');

    res.status(200).json({
      success: true,
      gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllGallery = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const gallery = await Gallery.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('addedBy', 'name');

    const total = await Gallery.countDocuments(filter);

    res.status(200).json({
      success: true,
      gallery,
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

const updateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, location, isFeatured } = req.body;

    const gallery = await Gallery.findByIdAndUpdate(
      id,
      { title, category, description, location, isFeatured },
      { new: true, runValidators: true }
    );

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    res.status(200).json({
      success: true,
      gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findByIdAndDelete(id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createGalleryImage,
  getGalleryByCategory,
  getFeaturedGallery,
  getAllGallery,
  updateGalleryImage,
  deleteGalleryImage
};
