const Testimonial = require('../models/Testimonial');

const createTestimonial = async (req, res) => {
  try {
    const { name, review, photo, designation, rating } = req.body;

    if (!name || !review) {
      return res.status(400).json({
        success: false,
        message: 'Name and review are required'
      });
    }

    const testimonial = await Testimonial.create({
      name,
      review,
      photo,
      designation,
      rating: rating || 5
    });

    res.status(201).json({
      success: true,
      testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllTestimonials = async (req, res) => {
  try {
    const { page = 1, limit = 20, approved = true } = req.query;
    let filter = { isApproved: approved === 'true' };

    const testimonials = await Testimonial.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Testimonial.countDocuments(filter);

    res.status(200).json({
      success: true,
      testimonials,
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

const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, review, photo, designation, rating, isApproved, order } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { name, review, photo, designation, rating, isApproved, order },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial approved successfully',
      testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials,
  getApprovedTestimonials,
  updateTestimonial,
  approveTestimonial,
  deleteTestimonial
};
