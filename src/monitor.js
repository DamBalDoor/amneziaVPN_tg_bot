const os = require('os');
const { VPN_SERVICE_NAME, VPN_CHECK_INTERVAL_MS } = require('./config');
const { checkVpnStatus } = require('./vpnStatus');
const { sendToAdmin } = require('./bot');

let lastVpnIsUp = null;

const monitorStats = {
  startedAt: Date.now(),
  lastCheckAt: null,
  lastIsUp: null,
  lastRaw: null,
  lastChangeAt: null,
  upEvents: 0,
  downEvents: 0
};

async function vpnMonitorLoop() {
  try {
    const { isUp, raw } = await checkVpnStatus();
    const now = Date.now();

    monitorStats.lastCheckAt = now;
    monitorStats.lastIsUp = isUp;
    monitorStats.lastRaw = raw;

    if (lastVpnIsUp === null) {
      lastVpnIsUp = isUp;
      monitorStats.lastChangeAt = now;
      await sendToAdmin(
        `🤖 Бот запущен на \`${os.hostname()}\`.\n` +
          `Текущий статус VPN-сервиса \`${VPN_SERVICE_NAME}\`: *${isUp ? 'ACTIVE' : 'INACTIVE'}* (${raw}).`
      );
      return;
    }

    if (isUp !== lastVpnIsUp) {
      lastVpnIsUp = isUp;
      monitorStats.lastChangeAt = now;
      if (isUp) {
        monitorStats.upEvents += 1;
        await sendToAdmin(
          `✅ VPN-сервис \`${VPN_SERVICE_NAME}\` восстановил работу (status: \`${raw}\`).`
        );
      } else {
        monitorStats.downEvents += 1;
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

function getMonitorStats() {
  return { ...monitorStats };
}

module.exports = {
  startMonitor,
  getMonitorStats
};

