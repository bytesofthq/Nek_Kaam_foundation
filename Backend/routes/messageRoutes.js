
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  sendMessage,
  getAllMessages,
  getMessageById,
  markAsReplied,
  deleteMessage,
  getUnreadCount
} = require('../controllers/messageController');

router.post('/', sendMessage);
router.get('/', protect, adminOnly, getAllMessages);
router.get('/unread/count', protect, adminOnly, getUnreadCount);
router.get('/:id', protect, adminOnly, getMessageById);
router.put('/:id/reply', protect, adminOnly, markAsReplied);
router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;