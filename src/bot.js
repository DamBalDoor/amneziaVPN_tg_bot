const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN, ADMIN_CHAT_ID } = require('./config');

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Регистрируем команды для меню Telegram
bot
  .setMyCommands([
    { command: 'help', description: 'Показать список команд' },
    { command: 'ping', description: 'Проверить, что бот жив' },
    { command: 'status', description: 'Показать статус VPN' },
    { command: 'stats', description: 'Показать статистику мониторинга' },
    { command: 'restart_vpn', description: 'Перезапустить VPN' },
    { command: 'reboot_server', description: 'Мягкий перезапуск сервера' }
  ])
  .catch((e) => {
    console.error('Не удалось установить список команд бота:', e.message);
  });

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

