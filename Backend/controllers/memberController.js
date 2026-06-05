
const Member = require('../models/Member');


const registerMember = async (req, res) => {
  try {
    const { fullName, phoneNumber, address, city, state, pinCode } = req.body;
    
    // Check required fields
    if (!fullName || !phoneNumber || !address || !city || !state || !pinCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    // Check if member exists
    const existingMember = await Member.findOne({ phoneNumber });
    if (existingMember) {
      return res.status(400).json({ 
        success: false, 
        message: 'Member already registered with this phone number' 
      });
    }
    
    // Create member
    const member = await Member.create({
      fullName,
      phoneNumber,
      address,
      city,
      state,
      pinCode
    });
    
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      member: {
        id: member._id,
        memberId: member.memberId,
        fullName: member.fullName,
        phoneNumber: member.phoneNumber,
        joinDate: member.joinDate
      }
    });
  } catch (error) {
    console.error('Member registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};



const getAllMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
          { memberId: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const members = await Member.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Member.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      members,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      member 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Member deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getMemberCount = async (req, res) => {
  try {
    const count = await Member.countDocuments();
    res.status(200).json({ 
      success: true, 
      count 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  registerMember,
  getAllMembers,
  getMemberById,
  deleteMember,
  getMemberCount
};