const fs = require('fs');
const path = require('path');
const { LOG_FILE_PATH, LOG_TAIL_LINES } = require('./loggerConfig');

function ensureLogDirExists() {
  const dir = path.dirname(LOG_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function formatLogLine(level, message, meta) {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] ${message}`;
  if (!meta) return base;
  let extra;
  try {
    extra = typeof meta === 'string' ? meta : JSON.stringify(meta);
  } catch {
    extra = String(meta);
  }
  return `${base} | ${extra}`;
}

function appendLine(line) {
  ensureLogDirExists();
  fs.appendFile(LOG_FILE_PATH, line + '\n', (err) => {
    if (err) {
      // Не падаем из-за ошибок логирования
      console.error('Ошибка записи в лог:', err.message);
    }
  });
}

function logInfo(message, meta) {
  appendLine(formatLogLine('info', message, meta));
}

function logError(message, meta) {
  appendLine(formatLogLine('error', message, meta));
}

function readLastLogLines() {
  try {
    if (!fs.existsSync(LOG_FILE_PATH)) {
      return [];
    }
    const content = fs.readFileSync(LOG_FILE_PATH, 'utf8');
    const lines = content.split('\n');
    const nonEmpty = lines.filter((l) => l.trim().length > 0);
    const n = LOG_TAIL_LINES;
    if (nonEmpty.length <= n) {
      return nonEmpty;
    }
    return nonEmpty.slice(nonEmpty.length - n);
  } catch (e) {
    console.error('Ошибка чтения лога:', e.message);
    return [`[LOGGER_ERROR] ${e.message}`];
  }
}

module.exports = {
  logInfo,
  logError,
  readLastLogLines
};

