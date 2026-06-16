
const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const FundCollection = require('../models/FundCollection');
const FundUsage = require('../models/FundUsage');
const Activity = require('../models/Activity');
const Project = require('../models/Project');
const ImpactStory = require('../models/ImpactStory');
const CommitteeMember = require('../models/CommitteeMember');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const NewsUpdate = require('../models/NewsUpdate');


// @desc    Get all statistics for homepage
// @access  Public
// @desc    Get all statistics for homepage
// @access  Public
router.get('/homepage-stats', async (req, res) => {
  try {
    const [
      totalMembers,
      totalFunds,
      totalUsed,
      totalProjects,
      totalActivities
    ] = await Promise.all([
      Member.countDocuments(),
      FundCollection.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      FundUsage.aggregate([{ $group: { _id: null, total: { $sum: '$amountUsed' } } }]),
      Project.countDocuments({ status: 'Completed' }),
      Activity.countDocuments()
    ]);
    
    // Additional stats for counters
    const familiesSupported = await FundUsage.countDocuments({ category: 'Poor Family Support' });
    const schoolsSupported = await FundUsage.countDocuments({ category: 'Schools Support' });
    const villagesHelped = await FundUsage.distinct('location').then(locations => locations.length);
    
    const received = totalFunds[0]?.total || 0;
    const used = totalUsed[0]?.total || 0;
    
    res.json({
      success: true,
      stats: {
        totalMembers,
        totalFundsReceived: received,
        totalFundsUsed: used,
        currentBalance: received - used,
        totalProjectsCompleted: totalProjects,
        familiesSupported,
        schoolsSupported,
        villagesHelped,
        totalActivities
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get stats at root for frontend Compatibility
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const [
      totalMembers,
      totalFunds,
      totalUsed,
      totalProjects
    ] = await Promise.all([
      Member.countDocuments(),
      FundCollection.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      FundUsage.aggregate([{ $group: { _id: null, total: { $sum: '$amountUsed' } } }]),
      Project.countDocuments({ status: 'Completed' })
    ]);
    
    const familiesSupported = await FundUsage.countDocuments({ category: 'Poor Family Support' });
    const schoolsSupported = await FundUsage.countDocuments({ category: 'Schools Support' });
    const villagesHelped = await FundUsage.distinct('location').then(locations => locations.length);
    
    const received = totalFunds[0]?.total || 0;
    const used = totalUsed[0]?.total || 0;
    
    res.json({
      success: true,
      totalMembers,
      totalFundsReceived: received,
      totalFundsUsed: used,
      currentBalance: received - used,
      totalProjects,
      familiesSupported,
      schoolsSupported,
      villagesHelped
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/latest-updates', async (req, res) => {
  try {
    const [latestActivities, latestNews, featuredStories] = await Promise.all([
      Activity.find().sort({ date: -1 }).limit(3).populate('project', 'title'),
      NewsUpdate.find({ isActive: true }).sort({ publishedDate: -1 }).limit(3),
      ImpactStory.find({ isApproved: true }).sort({ date: -1 }).limit(3)
    ]);
    
    res.json({
      success: true,
      data: {
        activities: latestActivities,
        news: latestNews,
        stories: featuredStories
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/transparency-summary', async (req, res) => {
  try {
    const [totalFunds, totalUsed, recentCollections, recentUsages] = await Promise.all([
      FundCollection.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      FundUsage.aggregate([{ $group: { _id: null, total: { $sum: '$amountUsed' } } }]),
      FundCollection.find().sort({ date: -1 }).limit(10),
      FundUsage.find().sort({ date: -1 }).limit(10)
    ]);
    
    const received = totalFunds[0]?.total || 0;
    const used = totalUsed[0]?.total || 0;
    
    res.json({
      success: true,
      data: {
        totalFundsReceived: received,
        totalFundsUsed: used,
        currentBalance: received - used,
        recentCollections,
        recentUsages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;