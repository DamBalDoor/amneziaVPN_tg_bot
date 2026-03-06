const path = require('path');

const LOG_FILE_PATH =
  process.env.LOG_FILE_PATH ||
  path.join(process.cwd(), 'logs', 'bot.log');

const LOG_TAIL_LINES = Number(process.env.LOG_TAIL_LINES || 100);

module.exports = {
  LOG_FILE_PATH,
  LOG_TAIL_LINES
};

