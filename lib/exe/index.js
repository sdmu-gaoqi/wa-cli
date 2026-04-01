const { spawn } = require("child_process");

const web2exe = (name, path, icon) => {
  spawn(
    `npx nativefier --name ${name} --icon ${icon} ${path}`,
    {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: true,
    },
  );
};

module.exports = web2exe;
