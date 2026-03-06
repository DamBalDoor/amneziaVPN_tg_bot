const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const { HELP_TEXT } = require('./help');

function registerStartCommand() {
  bot.onText(/^\/start$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }
    await bot.sendMessage(msg.chat.id, HELP_TEXT);
  });
}

module.exports = {
  registerStartCommand
};

