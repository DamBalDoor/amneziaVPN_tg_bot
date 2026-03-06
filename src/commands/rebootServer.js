const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const { execCommand } = require('../utils/execCommand');

// Максимальный "возраст" команды на перезагрузку (в секундах),
// чтобы не выполнять старые /reboot_server после рестарта бота
const MAX_REBOOT_COMMAND_AGE_SEC = 10;

function registerRebootServerCommand() {
  bot.onText(/^\/reboot_server$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const msgAgeSec = nowSec - msg.date;

    // Если команда слишком старая (например, была до предыдущего рестарта),
    // игнорируем её, чтобы избежать бесконечного цикла перезагрузок.
    if (msgAgeSec > MAX_REBOOT_COMMAND_AGE_SEC) {
      console.log(
        `Старая команда /reboot_server проигнорирована (возраст ${msgAgeSec} сек).`
      );
      return;
    }

    await bot.sendMessage(
      msg.chat.id,
      '⚠️ Запускаю мягкий перезапуск сервера. Бот временно будет недоступен.'
    );

    const cmd = 'sudo reboot';
    await execCommand(cmd);
  });
}

module.exports = {
  registerRebootServerCommand
};

