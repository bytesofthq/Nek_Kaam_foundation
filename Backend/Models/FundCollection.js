const mongoose = require('mongoose');

const fundCollectionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be greater than 0']
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
    trim: true,
    maxlength: [100, 'Source cannot exceed 100 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  receiptUrl: {
    type: String,
    default: ''
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isVerified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
fundCollectionSchema.index({ date: -1 });

module.exports = mongoose.model('FundCollection', fundCollectionSchema);