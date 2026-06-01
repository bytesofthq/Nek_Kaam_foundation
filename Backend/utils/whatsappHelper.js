// utils/whatsappHelper.js

/**
 * Generate WhatsApp click-to-chat link for admin reply
 * @param {string} phone - User's phone number
 * @param {string} name - User's name
 * @param {string} originalMessage - User's original message
 * @returns {string} WhatsApp link
 */
const generateWhatsAppLink = (phone, name, originalMessage) => {
  const cleanPhone = phone.toString().replace(/\D/g, '');
  let finalPhone = cleanPhone;
  
  if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
    finalPhone = `91${cleanPhone}`;
  }
  
  const whatsappText = `
🏢 *Nek Kaam Foundation*
📬 *New Message from ${name}*

💬 *Message:*
${originalMessage}

⏰ *Time:* ${new Date().toLocaleString()}

---
_Reply to this message to connect with ${name}_
  `.trim();
  
  const encodedText = encodeURIComponent(whatsappText);
  return `https://wa.me/${finalPhone}?text=${encodedText}`;
};

/**
 * Generate simple reply link for admin
 * @param {string} phone - User's phone number
 * @param {string} name - User's name
 * @returns {string} WhatsApp link for admin
 */
const generateAdminReplyLink = (phone, name) => {
  const cleanPhone = phone.toString().replace(/\D/g, '');
  const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  
  const replyText = `Hello ${name}, this is from Nek Kaam Foundation. Thanks for reaching out! How can we help you today?`;
  const encodedText = encodeURIComponent(replyText);
  
  return `https://wa.me/${finalPhone}?text=${encodedText}`;
};

module.exports = {
  generateWhatsAppLink,
  generateAdminReplyLink
};