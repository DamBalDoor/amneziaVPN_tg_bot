const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const {
  VPN_SERVICE_NAME,
  VPN_RESTART_CMD,
  VPN_RESTART_COOLDOWN_SEC
} = require('../config');
const { execCommand } = require('../utils/execCommand');
const { checkVpnStatus } = require('../vpnStatus');
const {
  getVpnRestartCooldownText,
  getVpnRestartStartText,
  getVpnRestartErrorText,
  getVpnRestartSuccessText
} = require('../messages');

let lastRestartAtMs = 0;

function registerRestartVpnCommand() {
  bot.onText(/^\/restart_vpn$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }

    const now = Date.now();
    const cooldownMs = VPN_RESTART_COOLDOWN_SEC * 1000;

    if (lastRestartAtMs && now - lastRestartAtMs < cooldownMs) {
      const remainingSec = Math.ceil((cooldownMs - (now - lastRestartAtMs)) / 1000);
      await bot.sendMessage(msg.chat.id, getVpnRestartCooldownText(remainingSec));
      return;
    }

    lastRestartAtMs = now;

    await bot.sendMessage(msg.chat.id, getVpnRestartStartText(), {
      parse_mode: 'Markdown'
    });

    const cmd =
      VPN_RESTART_CMD && VPN_RESTART_CMD.trim() !== ''
        ? VPN_RESTART_CMD
        : `sudo systemctl restart ${VPN_SERVICE_NAME}`;
    const result = await execCommand(cmd);

    if (!result.ok) {
      await bot.sendMessage(msg.chat.id, getVpnRestartErrorText(result.stderr || result.stdout), {
        parse_mode: 'Markdown'
      });
      return;
    }

    const { isUp, raw } = await checkVpnStatus();
    await bot.sendMessage(msg.chat.id, getVpnRestartSuccessText(isUp, raw), {
      parse_mode: 'Markdown'
    });
  });
}

module.exports = {
  registerRestartVpnCommand
};

