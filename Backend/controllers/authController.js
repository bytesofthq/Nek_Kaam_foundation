
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Member = require('../models/Member');



const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists"
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password
    });

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        type: "admin"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const refreshToken = jwt.sign(
      {
        id: admin._id,
        type: "admin"
      },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/"
    });

    return res.status(201).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profilePicture: admin.profilePicture
      }
    });

  } catch (err) {
    console.error("Error while registering admin:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }
    
    // Find admin
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();
    
    // Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, type: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: admin._id, type: 'admin' },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Set cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });
    
    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profilePicture: admin.profilePicture
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};


const memberLogin = async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;
    
    if (!fullName || !phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name and phone number' 
      });
    }
    
    const member = await Member.findOne({ fullName, phoneNumber });
    
    if (!member) {
      return res.status(401).json({ 
        success: false, 
        message: 'Member not found. Please register first.' 
      });
    }
    
    // Update last login
    member.lastLogin = Date.now();
    await member.save();
    
    // Generate token
    const token = jwt.sign(
      { id: member._id, isMember: true, memberId: member.memberId, type: 'member' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: member._id, type: 'member' },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '60d' }
    );
    
    // Set cookies
    res.cookie('memberToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.cookie('memberRefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 24 * 60 * 60 * 1000,
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
        city: member.city,
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


const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  
  res.clearCookie('memberToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  
  res.status(200).json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
};

const verifyAdmin = async (req, res) => {
  try {
    res.status(200).json({ 
      success: true, 
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const verifyMember = async (req, res) => {
  try {
    res.status(200).json({ 
      success: true, 
      member: {
        id: req.member._id,
        memberId: req.member.memberId,
        fullName: req.member.fullName,
        phoneNumber: req.member.phoneNumber,
        city: req.member.city,
        address: req.member.address,
        state: req.member.state,
        joinDate: req.member.joinDate
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  memberLogin,
  logout,
  verifyAdmin,
  verifyMember
};