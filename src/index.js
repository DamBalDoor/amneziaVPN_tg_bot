const os = require('os');
const { startMonitor } = require('./monitor');
const { registerCommands } = require('./commands');
const { VPN_SERVICE_NAME } = require('./config');

registerCommands();
startMonitor();

console.log(
  `Telegram-бот мониторинга Amnezia VPN запущен. Хост: ${os.hostname()}, сервис: ${VPN_SERVICE_NAME}`
);

