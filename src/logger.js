const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const EVENTS_LOG_PATH = path.join(LOG_DIR, 'events.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return `${timestamp} [${level}] ${message}${metaStr}`;
    })
  ),
  transports: [
    new transports.File({ filename: EVENTS_LOG_PATH })
  ]
});

function logEvent(event, message, meta = {}) {
  logger.info(`[${event}] ${message}`, meta);
}

function getEventsLogPath() {
  return EVENTS_LOG_PATH;
}

module.exports = {
  logEvent,
  getEventsLogPath
};

