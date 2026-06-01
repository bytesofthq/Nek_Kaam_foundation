// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Member = require('../models/Member');

// Protect admin routes - reads token from cookie
const protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's admin token
    if (decoded.type !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized as admin' });
    }
    
    // Get admin from database
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }
    
    req.admin = admin;
    req.adminToken = token;
    next();
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.admin && req.admin.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
};

// Verify member from cookie
const verifyMember = async (req, res, next) => {
  try {
    const token = req.cookies.memberToken;
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no member token' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'member') {
      return res.status(401).json({ success: false, message: 'Not authorized as member' });
    }
    
    const member = await Member.findById(decoded.id);
    
    if (!member) {
      return res.status(401).json({ success: false, message: 'Member not found' });
    }
    
    req.member = member;
    next();
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid member token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Member token expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

// Optional member verification (doesn't block if no token)
const optionalMember = async (req, res, next) => {
  try {
    const token = req.cookies.memberToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const member = await Member.findById(decoded.id);
      if (member) {
        req.member = member;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

// Refresh token middleware
const refreshAdminToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

    if (decoded.type !== 'admin') {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Admin not found or inactive' });
    }

    // Generate new tokens
    const newToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, type: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const newRefreshToken = jwt.sign(
      { id: admin._id, type: 'admin' },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set new cookies
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Refresh token expired' });
    }
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

// Refresh member token
const refreshMemberToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.memberRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

    if (decoded.type !== 'member') {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const member = await Member.findById(decoded.id);

    if (!member || !member.isActive) {
      return res.status(401).json({ success: false, message: 'Member not found or inactive' });
    }

    // Generate new tokens
    const newToken = jwt.sign(
      { id: member._id, isMember: true, memberId: member.memberId, type: 'member' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const newRefreshToken = jwt.sign(
      { id: member._id, type: 'member' },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '60d' }
    );

    // Set new cookies
    res.cookie('memberToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.cookie('memberRefreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      member: {
        id: member._id,
        memberId: member.memberId,
        fullName: member.fullName
      }
    });
  } catch (error) {
    console.error('Refresh member token error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Refresh token expired' });
    }
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

module.exports = { protect, adminOnly, verifyMember, optionalMember, refreshAdminToken, refreshMemberToken };