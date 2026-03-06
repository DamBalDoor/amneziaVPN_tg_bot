const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const { execCommand } = require('../utils/execCommand');

function registerRebootServerCommand() {
  bot.onText(/^\/reboot_server$/, async (msg) => {
    if (!isFromAdmin(msg)) {
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

