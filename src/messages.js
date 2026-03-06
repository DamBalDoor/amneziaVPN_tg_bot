const os = require('os');
const { VPN_SERVICE_NAME, VPN_CHECK_INTERVAL_MS } = require('./config');

function getHelpText() {
  return (
    'Привет! Я бот мониторинга Amnezia VPN.\n' +
    'Доступные команды:\n' +
    '/help - показать это сообщение\n' +
    '/ping - проверить, что бот жив\n' +
    '/status - показать статус VPN\n' +
    '/stats - показать статистику мониторинга\n' +
    '/restart_vpn - перезапустить VPN (через настроенную команду)\n' +
    '/reboot_server - мягкий перезапуск сервера\n' +
    '/logs_tail - показать хвост лога'
  );
}

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

function getStatsText(stats) {
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

  return (
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
    `Количество восстановлений: *${stats.upEvents}*`
  );
}

function getPingText() {
  return `🏓 Пинг-понг! Бот жив.\nХост: \`${os.hostname()}\`\nВремя (UTC): \`${new Date().toISOString()}\``;
}

function getVpnRestartCooldownText(remainingSec) {
  return `⏳ Слишком часто перезапускать VPN нельзя. Подожди ещё ${remainingSec} сек.`;
}

function getVpnRestartStartText() {
  return '⏳ Перезапускаю VPN...';
}

function getVpnRestartErrorText(errorText) {
  return `❌ Ошибка при перезапуске VPN:\n\`${errorText}\``;
}

function getVpnRestartSuccessText(isUp, raw) {
  return `✅ Команда перезапуска VPN выполнена.\nТекущий статус: *${
    isUp ? 'ACTIVE' : 'INACTIVE'
  }* (${raw}).`;
}

function getRebootConfirmPrompt() {
  return '⚠️ Точно перезагрузить сервер?';
}

function getRebootCancelledText() {
  return 'Перезагрузка сервера отменена.';
}

function getRebootAlreadyInProgressText() {
  return 'Перезагрузка уже выполняется.';
}

function getRebootStartText() {
  return '⚠️ Запускаю мягкий перезапуск сервера. Бот временно будет недоступен.';
}

function getMonitorStartupText(isUp, raw) {
  return (
    `🤖 Бот запущен на \`${os.hostname()}\`.\n` +
    `Текущий статус VPN-сервиса \`${VPN_SERVICE_NAME}\`: *${
      isUp ? 'ACTIVE' : 'INACTIVE'
    }* (${raw}).`
  );
}

function getMonitorUpText(raw) {
  return `✅ VPN-сервис \`${VPN_SERVICE_NAME}\` восстановил работу (status: \`${raw}\`).`;
}

function getMonitorDownText(raw) {
  return `❌ VPN-сервис \`${VPN_SERVICE_NAME}\` НЕ работает (status: \`${raw}\`).`;
}

module.exports = {
  getHelpText,
  getStatsText,
  getPingText,
  getVpnRestartCooldownText,
  getVpnRestartStartText,
  getVpnRestartErrorText,
  getVpnRestartSuccessText,
  getRebootConfirmPrompt,
  getRebootCancelledText,
  getRebootAlreadyInProgressText,
  getRebootStartText,
  getMonitorStartupText,
  getMonitorUpText,
  getMonitorDownText,
  formatDuration
};

