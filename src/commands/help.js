const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');

const HELP_TEXT =
  'Привет! Я бот мониторинга Amnezia VPN.\n' +
  'Доступные команды:\n' +
  '/help - показать это сообщение\n' +
  '/status - показать статус VPN\n' +
  '/restart_vpn - перезапустить VPN (через настроенную команду)\n' +
  '/reboot_server - мягкий перезапуск сервера';

function registerHelpCommand() {
  bot.onText(/^\/help$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }
    await bot.sendMessage(msg.chat.id, HELP_TEXT);
  });
}

module.exports = {
  HELP_TEXT,
  registerHelpCommand
};

