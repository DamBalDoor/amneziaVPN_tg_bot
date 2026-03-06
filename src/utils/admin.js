const { ADMIN_CHAT_ID } = require('../config');

function isFromAdmin(msg) {
  return String(msg.chat.id) === String(ADMIN_CHAT_ID);
}

module.exports = {
  isFromAdmin
};

