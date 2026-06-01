const CommitteeMember = require('../models/CommitteeMember');

const createCommitteeMember = async (req, res) => {
  try {
    const { photo, name, designation, phoneNumber, email, address, bio, order } = req.body;

    if (!name || !designation) {
      return res.status(400).json({
        success: false,
        message: 'Photo, name and designation are required'
      });
    }

    const member = await CommitteeMember.create({
      photo,
      name,
      designation,
      phoneNumber,
      email,
      address,
      bio,
      order
    });

    res.status(201).json({
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

const getAllCommitteeMembers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const members = await CommitteeMember.find({ isActive: true })
      .sort({ order: 1, designation: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CommitteeMember.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      members,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
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

const getCommitteeMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await CommitteeMember.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Committee member not found'
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

const updateCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { photo, name, designation, phoneNumber, email, address, bio, order } = req.body;

    const member = await CommitteeMember.findByIdAndUpdate(
      id,
      { photo, name, designation, phoneNumber, email, address, bio, order },
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Committee member not found'
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

const deleteCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await CommitteeMember.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Committee member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Committee member deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createCommitteeMember,
  getAllCommitteeMembers,
  getCommitteeMemberById,
  updateCommitteeMember,
  deleteCommitteeMember
};
