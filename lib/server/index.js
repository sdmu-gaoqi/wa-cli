const { spawn, exec, execSync } = require("child_process");
const fs = require("fs");
// minimist(process.argv.slice(2))

const server = (filePath, argv) => {
  const https = argv.https ?? false;
  const port = argv.port ?? 3000;

  try {
    const child = spawn(
      "http-server",
      [filePath, "-p", port, https ? `-S -C cert.pem -K key.pem` : ""],
      {
        cwd: process.cwd(),
        stdio: "inherit",
      }
    );
    child.on("close", (code) => process.exit(code));
  } catch (error) {
    console.log(error);
  }
};

module.exports = server;
