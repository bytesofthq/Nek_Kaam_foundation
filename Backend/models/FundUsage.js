const mongoose = require('mongoose');

const fundUsageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Marriage Assistance',
      'Poor Family Support',
      'Medical Help',
      'Educational Support',
      'Schools Support',
      'Water Pump Installation',
      'Freezer Installation',
      'AC Installation',
      'Community Cleaning',
      'Disaster Relief',
      'Emergency Help',
      'Other'
    ]
  },
  amountUsed: {
    type: Number,
    required: [true, 'Amount used is required'],
    min: [1, 'Amount must be greater than 0']
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    trim: true,
    maxlength: [200, 'Purpose cannot exceed 200 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  beneficiary: {
    type: String,
    required: [true, 'Beneficiary name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [{
    type: String,
    url: String,
    publicId: String
  }],
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  billUrl: {
    type: String,
    default: ''
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

fundUsageSchema.index({ date: -1, category: 1 });

module.exports = mongoose.model('FundUsage', fundUsageSchema);