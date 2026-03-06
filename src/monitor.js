const { VPN_CHECK_INTERVAL_MS } = require('./config');
const { checkVpnStatus } = require('./vpnStatus');
const { sendToAdmin } = require('./bot');
const {
  getMonitorStartupText,
  getMonitorUpText,
  getMonitorDownText
} = require('./messages');
const { logInfo, logError } = require('./logger');

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
      logInfo('monitor_start', { isUp, raw });
      await sendToAdmin(getMonitorStartupText(isUp, raw));
      return;
    }

    if (isUp !== lastVpnIsUp) {
      lastVpnIsUp = isUp;
      monitorStats.lastChangeAt = now;
      if (isUp) {
        monitorStats.upEvents += 1;
        logInfo('vpn_up', { raw });
        await sendToAdmin(getMonitorUpText(raw));
      } else {
        monitorStats.downEvents += 1;
        logError('vpn_down', { raw });
        await sendToAdmin(getMonitorDownText(raw));
      }
    }
  } catch (e) {
    console.error('Ошибка в мониторинге VPN:', e);
    logError('monitor_error', { message: e.message, stack: e.stack });
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

