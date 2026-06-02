const mongoose = require('mongoose');

const impactStorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  personName: {
    type: String,
    required: [true, 'Person/Family name is required'],
    trim: true
  },
  story: {
    type: String,
    required: [true, 'Story is required'],
    trim: true,
    maxlength: [2000, 'Story cannot exceed 2000 characters']
  },
  images: [{
    url: String,
    publicId: String
  }],
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ImpactStory', impactStorySchema);