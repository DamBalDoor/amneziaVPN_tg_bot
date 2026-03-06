const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const { getMonitorStats } = require('../monitor');
const { getStatsText } = require('../messages');

function registerStatsCommand() {
  bot.onText(/^\/stats$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }

    const stats = getMonitorStats();
    const text = getStatsText(stats);

    await bot.sendMessage(msg.chat.id, text, { parse_mode: 'Markdown' });
  });
}

module.exports = {
  registerStatsCommand
};

