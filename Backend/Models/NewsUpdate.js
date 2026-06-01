const mongoose = require('mongoose');

const newsUpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  type: {
    type: String,
    required: true,
    enum: ['Notice', 'Event', 'Update', 'Announcement'],
    default: 'Update'
  },
  image: {
    type: String,
    url: String,
    publicId: String,
    default: ''
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isPublished: {
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

newsUpdateSchema.index({ date: -1, isPinned: -1 });

module.exports = mongoose.model('NewsUpdate', newsUpdateSchema);
