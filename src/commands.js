const { VPN_SERVICE_NAME } = require('./config');
const { bot } = require('./bot');
const { isFromAdmin } = require('./utils/admin');
const { checkVpnStatus } = require('./vpnStatus');
const { execCommand } = require('./utils/execCommand');

function registerCommands() {
  // /start
  bot.onText(/^\/start$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }
    await bot.sendMessage(
      msg.chat.id,
      'Привет! Я бот мониторинга Amnezia VPN.\n' +
        'Доступные команды:\n' +
        '/status - показать статус VPN\n' +
        '/restart_vpn - перезапустить VPN-сервис\n' +
        '/reboot_server - мягкий перезапуск сервера'
    );
  });

  // /status
  bot.onText(/^\/status$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }
    const { isUp, raw } = await checkVpnStatus();
    await bot.sendMessage(
      msg.chat.id,
      `Статус VPN-сервиса \`${VPN_SERVICE_NAME}\`: *${isUp ? 'ACTIVE' : 'INACTIVE'}* (${raw}).`,
      { parse_mode: 'Markdown' }
    );
  });

  // /restart_vpn
  bot.onText(/^\/restart_vpn$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }

    await bot.sendMessage(msg.chat.id, `⏳ Перезапускаю VPN-сервис \`${VPN_SERVICE_NAME}\`...`, {
      parse_mode: 'Markdown'
    });

    const cmd = `sudo systemctl restart ${VPN_SERVICE_NAME}`;
    const result = await execCommand(cmd);

    if (!result.ok) {
      await bot.sendMessage(
        msg.chat.id,
        `❌ Ошибка при перезапуске VPN:\n\`${result.stderr || result.stdout}\``,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    const { isUp, raw } = await checkVpnStatus();
    await bot.sendMessage(
      msg.chat.id,
      `✅ Команда перезапуска VPN выполнена.\nТекущий статус: *${isUp ? 'ACTIVE' : 'INACTIVE'}* (${raw}).`,
      { parse_mode: 'Markdown' }
    );
  });

  // /reboot_server
  bot.onText(/^\/reboot_server$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }

    await bot.sendMessage(
      msg.chat.id,
      '⚠️ Запускаю мягкий перезапуск сервера. Бот временно будет недоступен.'
    );

    const cmd = 'sudo reboot';
    await execCommand(cmd);
  });
}

module.exports = {
  registerCommands
};

