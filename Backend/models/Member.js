const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberId: {
    type: String,
    unique: true,
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [60, 'Name cannot exceed 60 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  pinCode: {
    type: String,
    required: [true, 'Pin code is required'],
    match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pin code']
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Auto-generate member ID before validation
memberSchema.pre('validate', async function() {
  if (this.isNew && !this.memberId) {
    const count = await mongoose.model('Member').countDocuments();
    this.memberId = `NKF${String(count + 1).padStart(6, '0')}`;
  }
});

module.exports = mongoose.model('Member', memberSchema);