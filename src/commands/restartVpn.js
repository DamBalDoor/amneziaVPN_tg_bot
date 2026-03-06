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
const { logInfo, logError } = require('../logger');

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
      logInfo('vpn_restart_throttled', { remainingSec });
      await bot.sendMessage(msg.chat.id, getVpnRestartCooldownText(remainingSec));
      return;
    }

    lastRestartAtMs = now;

    logInfo('vpn_restart_requested', { from: msg.from?.id });

    await bot.sendMessage(msg.chat.id, getVpnRestartStartText(), {
      parse_mode: 'Markdown'
    });

    const cmd =
      VPN_RESTART_CMD && VPN_RESTART_CMD.trim() !== ''
        ? VPN_RESTART_CMD
        : `sudo systemctl restart ${VPN_SERVICE_NAME}`;
    logInfo('vpn_restart_exec', { cmd });
    const result = await execCommand(cmd);

    if (!result.ok) {
      logError('vpn_restart_failed', { stderr: result.stderr, stdout: result.stdout });
      await bot.sendMessage(msg.chat.id, getVpnRestartErrorText(result.stderr || result.stdout), {
        parse_mode: 'Markdown'
      });
      return;
    }

    const { isUp, raw } = await checkVpnStatus();
    logInfo('vpn_restart_status_after', { isUp, raw });
    await bot.sendMessage(msg.chat.id, getVpnRestartSuccessText(isUp, raw), {
      parse_mode: 'Markdown'
    });
  });
}

module.exports = {
  registerRestartVpnCommand
};

