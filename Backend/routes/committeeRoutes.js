const express = require('express');
const router = express.Router();
const CommitteeMember = require('../models/CommitteeMember');
const { protect, adminOnly } = require('../middleware/authMiddleware');


router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const member = await CommitteeMember.create(req.body);
    res.status(201).json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const members = await CommitteeMember.find({ isActive: true })
      .sort({ order: 1, designation: 1 });
    
    // Group by designation
    const grouped = {
      President: [],
      VicePresident: [],
      Secretary: [],
      Treasurer: [],
      CommitteeMember: [],
      Volunteer: []
    };
    
    members.forEach(member => {
      const key = member.designation.replace(' ', '');
      if (grouped[key]) {
        grouped[key].push(member);
      } else {
        grouped.CommitteeMember.push(member);
      }
    });
    
    res.json({ success: true, members: grouped, allMembers: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const member = await CommitteeMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/committee/:id
// @desc    Update committee member
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const member = await CommitteeMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await CommitteeMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Committee member deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
