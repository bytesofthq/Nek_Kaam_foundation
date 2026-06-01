
const Message = require('../models/Message');
const { generateWhatsAppLink, generateAdminReplyLink } = require('../utils/whatsappHelper');


const sendMessage = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    
    if (!name || !phone || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, phone and message are required' 
      });
    }
    
    const newMessage = await Message.create({
      name,
      phone,
      email: email || '',
      message,
      isRead: false,
      replied: false
    });
    
    // Generate WhatsApp link for easy reply
    const whatsappLink = generateWhatsAppLink(phone, name, message);
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: {
        id: newMessage._id,
        name: newMessage.name,
        phone: newMessage.phone
      },
      whatsappLink
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    let filter = {};
    
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }
    
    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Message.countDocuments(filter);
    
    // Add WhatsApp reply links
    const messagesWithLinks = messages.map(msg => ({
      ...msg._doc,
      whatsappReplyLink: generateAdminReplyLink(msg.phone, msg.name)
    }));
    
    res.status(200).json({
      success: true,
      messages: messagesWithLinks,
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

const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    
    // Mark as read
    if (!message.isRead) {
      message.isRead = true;
      await message.save();
    }
    
    res.status(200).json({
      success: true,
      message,
      whatsappReplyLink: generateAdminReplyLink(message.phone, message.name)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const markAsReplied = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    
    message.replied = true;
    message.isRead = true;
    await message.save();
    
    res.status(200).json({
      success: true,
      message: 'Marked as replied',
      whatsappLink: generateAdminReplyLink(message.phone, message.name)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Message deleted' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({ isRead: false });
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
  sendMessage,
  getAllMessages,
  getMessageById,
  markAsReplied,
  deleteMessage,
  getUnreadCount
};