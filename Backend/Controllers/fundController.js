
const FundCollection = require('../models/FundCollection');
const FundUsage = require('../models/FundUsage');




const addFundCollection = async (req, res) => {
  try {
    const { amount, source, date, notes, receiptUrl } = req.body;
    
    if (!amount || !source || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount, source and date are required' 
      });
    }
    
    const collection = await FundCollection.create({
      amount,
      source,
      date,
      notes,
      receiptUrl,
      addedBy: req.admin._id
    });
    
    res.status(201).json({ 
      success: true, 
      collection 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getFundCollections = async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate } = req.query;
    let filter = {};
    
    if (startDate && endDate) {
      filter.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    const collections = await FundCollection.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('addedBy', 'name');
    
    const total = await FundCollection.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      collections,
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total 
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getTotalFundCollections = async (req, res) => {
  try {
    const result = await FundCollection.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const total = result[0]?.total || 0;
    res.status(200).json({ 
      success: true, 
      total 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const deleteFundCollection = async (req, res) => {
  try {
    await FundCollection.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
      success: true, 
      message: 'Fund collection deleted' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const addFundUsage = async (req, res) => {
  try {
    const { title, category, amountUsed, purpose, location, beneficiary, description, images, date, billUrl } = req.body;
    
    if (!title || !category || !amountUsed || !purpose || !location || !beneficiary || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be filled' 
      });
    }
    
    const usage = await FundUsage.create({
      title,
      category,
      amountUsed,
      purpose,
      location,
      beneficiary,
      description,
      images,
      date,
      billUrl,
      addedBy: req.admin._id
    });
    
    res.status(201).json({ 
      success: true, 
      usage 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getFundUsages = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    const usages = await FundUsage.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('addedBy', 'name');
    
    const total = await FundUsage.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      usages,
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total 
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getTotalFundUsage = async (req, res) => {
  try {
    const result = await FundUsage.aggregate([
      { $group: { _id: null, total: { $sum: '$amountUsed' } } }
    ]);
    
    const total = result[0]?.total || 0;
    res.status(200).json({ 
      success: true, 
      total 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getFundSummary = async (req, res) => {
  try {
    const [totalReceived, totalUsed] = await Promise.all([
      FundCollection.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      FundUsage.aggregate([{ $group: { _id: null, total: { $sum: '$amountUsed' } } }])
    ]);
    
    const received = totalReceived[0]?.total || 0;
    const used = totalUsed[0]?.total || 0;
    
    res.status(200).json({
      success: true,
      summary: {
        totalFundsReceived: received,
        totalFundsUsed: used,
        currentBalance: received - used
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const deleteFundUsage = async (req, res) => {
  try {
    await FundUsage.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
      success: true, 
      message: 'Fund usage deleted' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  addFundCollection,
  getFundCollections,
  getTotalFundCollections,
  deleteFundCollection,
  addFundUsage,
  getFundUsages,
  getTotalFundUsage,
  getFundSummary,
  deleteFundUsage
};