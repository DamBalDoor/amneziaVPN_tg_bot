const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN, ADMIN_CHAT_ID } = require('./config');

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

async function sendToAdmin(text, options = {}) {
  try {
    await bot.sendMessage(ADMIN_CHAT_ID, text, {
      parse_mode: 'Markdown',
      ...options
    });
  } catch (e) {
    console.error('Не удалось отправить сообщение админу:', e.message);
  }
}

module.exports = {
  bot,
  sendToAdmin
};

