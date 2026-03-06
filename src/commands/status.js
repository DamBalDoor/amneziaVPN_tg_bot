const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const { VPN_SERVICE_NAME } = require('../config');
const { checkVpnStatus } = require('../vpnStatus');

function registerStatusCommand() {
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
}

module.exports = {
  registerStatusCommand
};

