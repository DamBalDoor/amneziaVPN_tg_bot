const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const { getPingText } = require('../messages');

function registerPingCommand() {
  bot.onText(/^\/ping$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }
    await bot.sendMessage(msg.chat.id, getPingText(), { parse_mode: 'Markdown' });
  });
}

module.exports = {
  registerPingCommand
};

