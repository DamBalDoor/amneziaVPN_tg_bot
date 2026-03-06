const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const { readLastLogLines } = require('../logger');
const { LOG_TAIL_LINES, LOG_FILE_PATH } = require('../loggerConfig');

function registerLogsTailCommand() {
  bot.onText(/^\/logs_tail$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }

    const lines = readLastLogLines();

    if (!lines.length) {
      await bot.sendMessage(
        msg.chat.id,
        'Лог-файл пуст или ещё не создан.',
        { parse_mode: 'Markdown' }
      );
      return;
    }

    const header =
      `Последние ${Math.min(LOG_TAIL_LINES, lines.length)} строк лога:\n` +
      `\`\`\`\n`;
    const body = lines.join('\n');
    const footer = '\n```';

    const text = header + body + footer;

    // На всякий случай режем по длине, чтобы не упереться в лимит Telegram
    const MAX_LEN = 3500;
    const trimmed =
      text.length > MAX_LEN ? text.slice(0, MAX_LEN - 10) + '\n[...cut...]```' : text;

    await bot.sendMessage(msg.chat.id, trimmed, { parse_mode: 'Markdown' });
  });
}

module.exports = {
  registerLogsTailCommand
};

