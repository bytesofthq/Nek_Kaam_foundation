const mongoose = require('mongoose');

const committeeMemberSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: [true, 'Photo is required'],
    url: String,
    publicId: String
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters']
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    enum: ['President', 'Vice President', 'Secretary', 'Treasurer', 'Committee Member', 'Volunteer']
  },
  phoneNumber: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    default: ''
  },
  email: {
    type: String,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

committeeMemberSchema.index({ order: 1, designation: 1 });

module.exports = mongoose.model('CommitteeMember', committeeMemberSchema);