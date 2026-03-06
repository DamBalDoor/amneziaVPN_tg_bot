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
const { logEvent } = require('../logger');

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
      logEvent('vpn_restart_throttled', 'VPN restart throttled', {
        chatId: msg.chat.id,
        remainingSec
      });
      return;
    }

    lastRestartAtMs = now;
    logEvent('vpn_restart_requested', 'VPN restart requested', {
      chatId: msg.chat.id,
      from: msg.from?.id
    });

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
      logEvent('vpn_restart_error', 'VPN restart failed', {
        chatId: msg.chat.id,
        error: result.stderr || result.stdout
      });
      return;
    }

    const { isUp, raw } = await checkVpnStatus();
    await bot.sendMessage(msg.chat.id, getVpnRestartSuccessText(isUp, raw), {
      parse_mode: 'Markdown'
    });
    logEvent('vpn_restart_success', 'VPN restart completed', { isUp, raw });
  });
}

module.exports = {
  registerRestartVpnCommand
};

