const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters']
  },
  review: {
    type: String,
    required: [true, 'Review is required'],
    trim: true,
    maxlength: [500, 'Review cannot exceed 500 characters']
  },
  photo: {
    type: String,
    url: String,
    publicId: String,
    default: ''
  },
  designation: {
    type: String,
    trim: true,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);