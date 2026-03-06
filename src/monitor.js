const os = require('os');
const { VPN_SERVICE_NAME, VPN_CHECK_INTERVAL_MS } = require('./config');
const { checkVpnStatus } = require('./vpnStatus');
const { sendToAdmin } = require('./bot');

let lastVpnIsUp = null;

async function vpnMonitorLoop() {
  try {
    const { isUp, raw } = await checkVpnStatus();

    if (lastVpnIsUp === null) {
      lastVpnIsUp = isUp;
      await sendToAdmin(
        `🤖 Бот запущен на \`${os.hostname()}\`.\n` +
          `Текущий статус VPN-сервиса \`${VPN_SERVICE_NAME}\`: *${isUp ? 'ACTIVE' : 'INACTIVE'}* (${raw}).`
      );
      return;
    }

    if (isUp !== lastVpnIsUp) {
      lastVpnIsUp = isUp;
      if (isUp) {
        await sendToAdmin(
          `✅ VPN-сервис \`${VPN_SERVICE_NAME}\` восстановил работу (status: \`${raw}\`).`
        );
      } else {
        await sendToAdmin(
          `❌ VPN-сервис \`${VPN_SERVICE_NAME}\` НЕ работает (status: \`${raw}\`).`
        );
      }
    }
  } catch (e) {
    console.error('Ошибка в мониторинге VPN:', e);
  }
}

function startMonitor() {
  setInterval(vpnMonitorLoop, VPN_CHECK_INTERVAL_MS);
  vpnMonitorLoop();
}

module.exports = {
  startMonitor
};

