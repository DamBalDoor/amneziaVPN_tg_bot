const { VPN_CHECK_INTERVAL_MS } = require('./config');
const { checkVpnStatus } = require('./vpnStatus');
const { sendToAdmin } = require('./bot');
const {
  getMonitorStartupText,
  getMonitorUpText,
  getMonitorDownText
} = require('./messages');
const { logEvent } = require('./logger');

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
      logEvent('monitor_start', 'Monitor started', { isUp, raw });
      await sendToAdmin(getMonitorStartupText(isUp, raw));
      return;
    }

    if (isUp !== lastVpnIsUp) {
      lastVpnIsUp = isUp;
      monitorStats.lastChangeAt = now;
      if (isUp) {
        monitorStats.upEvents += 1;
        logEvent('vpn_up', 'VPN status changed to UP', { raw });
        await sendToAdmin(getMonitorUpText(raw));
      } else {
        monitorStats.downEvents += 1;
        logEvent('vpn_down', 'VPN status changed to DOWN', { raw });
        await sendToAdmin(getMonitorDownText(raw));
      }
    }
  } catch (e) {
    console.error('Ошибка в мониторинге VPN:', e);
    logEvent('monitor_error', 'Error in VPN monitor loop', { error: e.message });
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

