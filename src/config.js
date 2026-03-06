require('dotenv').config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const VPN_SERVICE_NAME = process.env.VPN_SERVICE_NAME || 'amnezia-vpn';
const VPN_CHECK_INTERVAL_MS = Number(process.env.VPN_CHECK_INTERVAL_MS || 60000);
const VPN_HEALTHCHECK_CMD = process.env.VPN_HEALTHCHECK_CMD;
const VPN_RESTART_CMD = process.env.VPN_RESTART_CMD;

if (!BOT_TOKEN) {
  console.error('ERROR: TELEGRAM_BOT_TOKEN не задан в .env');
  process.exit(1);
}

if (!ADMIN_CHAT_ID) {
  console.error('ERROR: TELEGRAM_ADMIN_CHAT_ID не задан в .env');
  process.exit(1);
}

module.exports = {
  BOT_TOKEN,
  ADMIN_CHAT_ID,
  VPN_SERVICE_NAME,
  VPN_CHECK_INTERVAL_MS,
  VPN_HEALTHCHECK_CMD,
  VPN_RESTART_CMD
};

