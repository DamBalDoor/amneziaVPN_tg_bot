const { registerHelpCommand } = require('./help');
const { registerStartCommand } = require('./start');
const { registerStatusCommand } = require('./status');
const { registerRestartVpnCommand } = require('./restartVpn');
const { registerRebootServerCommand } = require('./rebootServer');
const { registerStatsCommand } = require('./stats');
const { registerPingCommand } = require('./ping');

function registerCommands() {
  registerHelpCommand();
  registerStartCommand();
  registerStatusCommand();
  registerRestartVpnCommand();
  registerRebootServerCommand();
  registerStatsCommand();
  registerPingCommand();
}

module.exports = {
  registerCommands
};

