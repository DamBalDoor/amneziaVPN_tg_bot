const { exec } = require('child_process');

function execCommand(cmd) {
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        resolve({ ok: false, stdout, stderr: stderr || error.message });
        return;
      }
      resolve({ ok: true, stdout, stderr });
    });
  });
}

module.exports = {
  execCommand
};

