const { bot } = require('../bot');
const { isFromAdmin } = require('../utils/admin');
const { execCommand } = require('../utils/execCommand');
const {
  getRebootConfirmPrompt,
  getRebootCancelledText,
  getRebootAlreadyInProgressText,
  getRebootStartText
} = require('../messages');

let rebootInProgress = false;

function registerRebootServerCommand() {
  // Обработка текстовой команды
  bot.onText(/^\/reboot_server$/, async (msg) => {
    if (!isFromAdmin(msg)) {
      return;
    }

    await bot.sendMessage(msg.chat.id, getRebootConfirmPrompt(), {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Да, перезагрузить', callback_data: 'reboot_server_confirm' },
            { text: 'Отмена', callback_data: 'reboot_server_cancel' }
          ]
        ]
      }
    });
  });

  // Обработка нажатий на inline-кнопки
  bot.on('callback_query', async (query) => {
    const { data, message } = query;

    if (!data || !message) {
      return;
    }

    if (!data.startsWith('reboot_server_')) {
      return;
    }

    if (!isFromAdmin(message)) {
      await bot.answerCallbackQuery(query.id, { text: 'Нет доступа', show_alert: true });
      return;
    }

    if (data === 'reboot_server_cancel') {
      await bot.answerCallbackQuery(query.id, { text: getRebootCancelledText() });
      await bot.editMessageText(getRebootCancelledText(), {
        chat_id: message.chat.id,
        message_id: message.message_id
      });
      return;
    }

    if (data === 'reboot_server_confirm') {
      if (rebootInProgress) {
        await bot.answerCallbackQuery(query.id, {
          text: getRebootAlreadyInProgressText(),
          show_alert: true
        });
        return;
      }

      rebootInProgress = true;

      await bot.answerCallbackQuery(query.id, { text: 'Запускаю перезагрузку...' });

      await bot.editMessageText(getRebootStartText(), {
        chat_id: message.chat.id,
        message_id: message.message_id
      });

      const cmd = 'sudo reboot';
      await execCommand(cmd);
    }
  });
}

module.exports = {
  registerRebootServerCommand
};

