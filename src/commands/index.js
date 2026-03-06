const { registerHelpCommand } = require('./help');
const { registerStartCommand } = require('./start');
const { registerStatusCommand } = require('./status');
const { registerRestartVpnCommand } = require('./restartVpn');
const { registerRebootServerCommand } = require('./rebootServer');

function registerCommands() {
  registerHelpCommand();
  registerStartCommand();
  registerStatusCommand();
  registerRestartVpnCommand();
  registerRebootServerCommand();
}

module.exports = {
  registerCommands
};

