const os = require('os');
const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const { VPN_SERVICE_NAME, VPN_CHECK_INTERVAL_MS } = require('../config');
const { getMonitorStats } = require('../monitor');

function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const parts = [];
  if (days) parts.push(`${days}д`);
  if (hours) parts.push(`${hours}ч`);
  if (minutes) parts.push(`${minutes}м`);
  if (!parts.length || seconds) parts.push(`${seconds}с`);

  return parts.join(' ');
}

function registerStatsCommand() {
  bot.onText(/^\/stats$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }

    const stats = getMonitorStats();
    const now = Date.now();

    const uptime =
      stats.startedAt != null ? formatDuration(now - stats.startedAt) : 'н/д';
    const lastCheck =
      stats.lastCheckAt != null
        ? new Date(stats.lastCheckAt).toISOString()
        : 'ещё не было';
    const lastChange =
      stats.lastChangeAt != null
        ? new Date(stats.lastChangeAt).toISOString()
        : 'ещё не было';

    const lastStatus =
      stats.lastIsUp == null
        ? 'ещё не определён'
        : stats.lastIsUp
        ? 'ACTIVE'
        : 'INACTIVE';

    const text =
      `ℹ️ Статистика бота и VPN\n` +
      `Хост: \`${os.hostname()}\`\n` +
      `Сервис/healthcheck: \`${VPN_SERVICE_NAME}\`\n` +
      `Интервал проверки: ${VPN_CHECK_INTERVAL_MS} мс\n\n` +
      `Время работы бота: *${uptime}*\n` +
      `Последняя проверка: \`${lastCheck}\`\n` +
      `Последнее изменение статуса: \`${lastChange}\`\n` +
      `Текущий статус: *${lastStatus}*\n` +
      `Последний raw-статус: \`${stats.lastRaw ?? 'н/д'}\`\n\n` +
      `Количество падений VPN: *${stats.downEvents}*\n` +
      `Количество восстановлений: *${stats.upEvents}*`;

    await bot.sendMessage(msg.chat.id, text, { parse_mode: 'Markdown' });
  });
}

module.exports = {
  registerStatsCommand
};

