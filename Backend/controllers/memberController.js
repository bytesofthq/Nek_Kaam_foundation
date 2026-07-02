
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');



const registerMember = async (req, res) => {
  try {
    const { fullName, phoneNumber, country, address, city, state, pinCode } = req.body;
    
    // Check required fields
    if (!fullName || !phoneNumber || !country || !address || !city || !state || !pinCode) {
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
      country,
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
        country: member.country,
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

const loginMember = async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;

    if (!fullName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required'
      });
    }

    // Find member by phone number
    const member = await Member.findOne({ phoneNumber });

    if (!member) {
      return res.status(401).json({
        success: false,
        message: 'No member found with this phone number. Please register first.'
      });
    }

    if (!member.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your membership is inactive. Please contact the administrator.'
      });
    }

    // Verify name (case-insensitive and trimmed)
    const normalizedDbName = member.fullName.trim().toLowerCase();
    const normalizedInputName = fullName.trim().toLowerCase();

    if (normalizedDbName !== normalizedInputName) {
      return res.status(401).json({
        success: false,
        message: 'The name provided does not match our records for this phone number.'
      });
    }

    // Update last login
    member.lastLogin = Date.now();
    await member.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: member._id, type: 'member' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set cookie
    const isProd = process.env.NODE_ENV === 'production' || req.hostname !== 'localhost';
    res.cookie('memberToken', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.status(200).json({
      success: true,
      token,
      member: {
        id: member._id,
        memberId: member.memberId,
        fullName: member.fullName,
        phoneNumber: member.phoneNumber,
        country: member.country,
        address: member.address,
        city: member.city,
        state: member.state,
        pinCode: member.pinCode,
        joinDate: member.joinDate
      }
    });

  } catch (error) {
    console.error('Member login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

const getMemberProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      member: {
        id: req.member._id,
        memberId: req.member.memberId,
        fullName: req.member.fullName,
        phoneNumber: req.member.phoneNumber,
        country: req.member.country,
        address: req.member.address,
        city: req.member.city,
        state: req.member.state,
        pinCode: req.member.pinCode,
        joinDate: req.member.joinDate,
        createdAt: req.member.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateMemberProfile = async (req, res) => {
  try {
    const { address, city, state, pinCode } = req.body;

    const member = await Member.findById(req.member._id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Update only editable fields
    if (address !== undefined) member.address = address;
    if (city !== undefined) member.city = city;
    if (state !== undefined) member.state = state;
    if (pinCode !== undefined) member.pinCode = pinCode;

    await member.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      member: {
        id: member._id,
        memberId: member.memberId,
        fullName: member.fullName,
        phoneNumber: member.phoneNumber,
        country: member.country,
        address: member.address,
        city: member.city,
        state: member.state,
        pinCode: member.pinCode,
        joinDate: member.joinDate,
        createdAt: member.createdAt
      }
    });
  } catch (error) {
    console.error('Member profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during profile update'
    });
  }
};

module.exports = {
  registerMember,
  loginMember,
  getMemberProfile,
  updateMemberProfile,
  getAllMembers,
  getMemberById,
  deleteMember,
  getMemberCount
};