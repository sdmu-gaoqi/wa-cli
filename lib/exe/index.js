const { spawn } = require("child_process");

const web2exe = (name, path) => {
  spawn(`npx nativefier --name ${name} ${path}`, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true,
  });
};

module.exports = web2exe;
