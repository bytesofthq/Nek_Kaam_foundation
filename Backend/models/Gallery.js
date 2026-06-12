const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Schools Projects',
      'Marriage Assistance',
      'Water Projects',
      'Medical Help',
      'Community Activities'
    ]
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
    url: String,
    publicId: String
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

gallerySchema.index({ category: 1, date: -1 });

module.exports = mongoose.model('Gallery', gallerySchema);