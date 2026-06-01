// controllers/dashboardController.js
const Member = require('../models/Member');
const FundCollection = require('../models/FundCollection');
const FundUsage = require('../models/FundUsage');
const Activity = require('../models/Activity');
const Project = require('../models/Project');
const Message = require('../models/Message');


const getDashboardStats = async (req, res) => {
  try {
    const [
      totalMembers,
      totalFunds,
      totalUsed,
      totalActivities,
      totalProjects,
      unreadMessages
    ] = await Promise.all([
      Member.countDocuments(),
      FundCollection.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      FundUsage.aggregate([{ $group: { _id: null, total: { $sum: '$amountUsed' } } }]),
      Activity.countDocuments(),
      Project.countDocuments(),
      Message.countDocuments({ isRead: false })
    ]);
    
    const received = totalFunds[0]?.total || 0;
    const used = totalUsed[0]?.total || 0;
    
    // Get project counts by status
    const projectCounts = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const projectStats = { Planned: 0, Ongoing: 0, Completed: 0 };
    projectCounts.forEach(item => {
      projectStats[item._id] = item.count;
    });
    
    res.status(200).json({
      success: true,
      stats: {
        totalMembers,
        totalFundsReceived: received,
        totalFundsUsed: used,
        currentBalance: received - used,
        totalActivities,
        totalProjects,
        unreadMessages,
        projectStats
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getMonthlyFundData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Monthly collections
    const collections = await FundCollection.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    // Monthly usage
    const usages = await FundUsage.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amountUsed' }
        }
      }
    ]);
    
    const collectionData = new Array(12).fill(0);
    const usageData = new Array(12).fill(0);
    
    collections.forEach(item => {
      collectionData[item._id - 1] = item.total;
    });
    
    usages.forEach(item => {
      usageData[item._id - 1] = item.total;
    });
    
    res.status(200).json({
      success: true,
      data: {
        months,
        collections: collectionData,
        usages: usageData
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getMemberGrowth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const memberGrowth = await Member.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const growthData = new Array(12).fill(0);
    memberGrowth.forEach(item => {
      growthData[item._id - 1] = item.count;
    });
    
    // Calculate cumulative
    let cumulative = 0;
    const cumulativeData = growthData.map(count => {
      cumulative += count;
      return cumulative;
    });
    
    res.status(200).json({
      success: true,
      data: {
        months,
        monthly: growthData,
        cumulative: cumulativeData
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const [activities, recentMembers, recentMessages] = await Promise.all([
      Activity.find().sort({ createdAt: -1 }).limit(5),
      Member.find().sort({ createdAt: -1 }).limit(5),
      Message.find().sort({ createdAt: -1 }).limit(5)
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        activities,
        recentMembers,
        recentMessages
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getCategoryWiseUsage = async (req, res) => {
  try {
    const categoryUsage = await FundUsage.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amountUsed' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: categoryUsage
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  getDashboardStats,
  getMonthlyFundData,
  getMemberGrowth,
  getRecentActivities,
  getCategoryWiseUsage
};