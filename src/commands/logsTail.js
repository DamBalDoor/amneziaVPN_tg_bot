const fs = require('fs');
const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const { getEventsLogPath } = require('../logger');

const DEFAULT_TAIL_LINES = 10;

function tailFileLines(filePath, maxLines) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const slice = lines.slice(-maxLines).filter((l) => l.trim().length > 0);
    return slice.join('\n');
  } catch (e) {
    return `Ошибка чтения лога: ${e.message}`;
  }
}

function registerLogsTailCommand() {
  bot.onText(/^\/logs_tail(?:\s+(\d+))?$/, async (msg, match) => {
    if (!isFromAdmin(msg)) {
      return;
    }

    const rawN = match && match[1];
    let n = DEFAULT_TAIL_LINES;

    if (rawN) {
      const parsed = parseInt(rawN, 10);
      if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 500) {
        n = parsed;
      }
    }

    const logPath = getEventsLogPath();
    const text = tailFileLines(logPath, n);

    if (text === null) {
      await bot.sendMessage(msg.chat.id, 'Лог пока не создан или пуст.');
      return;
    }

    const escaped = text.replace(/`/g, 'ˋ');

    await bot.sendMessage(
      msg.chat.id,
      `Последние ${n} строк лога:\n\`\`\`\n${escaped}\n\`\`\``,
      { parse_mode: 'Markdown' }
    );
  });
}

module.exports = {
  registerLogsTailCommand
};

