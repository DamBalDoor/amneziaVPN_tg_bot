const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const { getHelpText } = require('../messages');

function registerHelpCommand() {
  bot.onText(/^\/help$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }
    await bot.sendMessage(msg.chat.id, getHelpText());
  });
}

module.exports = {
  registerHelpCommand
};

