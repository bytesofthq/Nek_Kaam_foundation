const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['General', 'SEO', 'Social', 'Contact', 'Homepage', 'Transparency'],
    default: 'General'
  }
}, {
  timestamps: true
});

// Predefined settings keys
settingSchema.statics.getDefaultSettings = function() {
  return {
    siteName: 'Nek Kaam Foundation',
    siteTagline: 'Together We Help Communities',
    siteEmail: 'info@nekkaamfoundation.org',
    sitePhone: '+91XXXXXXXXXX',
    siteAddress: 'Akbapur Post Kamhra kalan Biswan Sitapur',
    
    metaDescription: 'Nek Kaam Foundation - Building trust through transparency',
    metaKeywords: 'NGO, charity, transparency, community help',
    footerText: '© 2026 Nek Kaam Foundation. All rights reserved.',
    visitorCount: 0,
    darkModeEnabled: false,
    maintenanceMode: false
  };
};

module.exports = mongoose.model('Setting', settingSchema);