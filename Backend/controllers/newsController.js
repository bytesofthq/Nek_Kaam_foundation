const NewsUpdate = require('../models/NewsUpdate');

const createNews = async (req, res) => {
  try {
    const { title, content, type, image, date, endDate, isPinned } = req.body;

    if (!title || !content || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title, content and type are required'
      });
    }

    const news = await NewsUpdate.create({
      title,
      content,
      type,
      image,
      date,
      endDate,
      isPinned: isPinned || false,
      addedBy: req.admin._id
    });

    res.status(201).json({
      success: true,
      news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    let filter = { isPublished: true };

    if (type) {
      filter.type = type;
    }

    const news = await NewsUpdate.find(filter)
      .sort({ isPinned: -1, date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('addedBy', 'name');

    const total = await NewsUpdate.countDocuments(filter);

    res.status(200).json({
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRecentNews = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const news = await NewsUpdate.find({ isPublished: true })
      .sort({ isPinned: -1, date: -1 })
      .limit(limit)
      .populate('addedBy', 'name');

    res.status(200).json({
      success: true,
      news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await NewsUpdate.findById(id)
      .populate('addedBy', 'name email');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    res.status(200).json({
      success: true,
      news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, image, date, endDate, isPinned, isPublished } = req.body;

    const news = await NewsUpdate.findByIdAndUpdate(
      id,
      { title, content, type, image, date, endDate, isPinned, isPublished },
      { new: true, runValidators: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    res.status(200).json({
      success: true,
      news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await NewsUpdate.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'News deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getRecentNews,
  getNewsById,
  updateNews,
  deleteNews
};
