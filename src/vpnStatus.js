const { VPN_SERVICE_NAME, VPN_HEALTHCHECK_CMD } = require('./config');
const { execCommand } = require('./utils/execCommand');

async function checkVpnStatus() {
  // Если задана команда healthcheck'а — используем её
  if (VPN_HEALTHCHECK_CMD && VPN_HEALTHCHECK_CMD.trim() !== '') {
    const result = await execCommand(VPN_HEALTHCHECK_CMD);

    if (!result.ok) {
      return { isUp: false, raw: result.stderr || result.stdout || 'healthcheck failed' };
    }

    const out = (result.stdout || '').trim();
    return { isUp: true, raw: out || 'healthcheck ok' };
  }

  // Fallback: проверка systemd-сервиса (если команда не задана)
  const cmd = `systemctl is-active ${VPN_SERVICE_NAME}`;
  const result = await execCommand(cmd);

  if (!result.ok) {
    return { isUp: false, raw: result.stderr || result.stdout || 'unknown error' };
  }

  const status = (result.stdout || '').trim();
  const isUp = status === 'active';
  return { isUp, raw: status };
}

module.exports = {
  checkVpnStatus
};

