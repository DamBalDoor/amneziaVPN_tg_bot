const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const { VPN_SERVICE_NAME, VPN_RESTART_CMD } = require('../config');
const { execCommand } = require('../utils/execCommand');
const { checkVpnStatus } = require('../vpnStatus');

function registerRestartVpnCommand() {
  bot.onText(/^\/restart_vpn$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }

    await bot.sendMessage(msg.chat.id, `⏳ Перезапускаю VPN...`, {
      parse_mode: 'Markdown'
    });

    const cmd =
      VPN_RESTART_CMD && VPN_RESTART_CMD.trim() !== ''
        ? VPN_RESTART_CMD
        : `sudo systemctl restart ${VPN_SERVICE_NAME}`;
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
}

module.exports = {
  registerRestartVpnCommand
};

