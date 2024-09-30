const chalk = require("chalk");

const log = {
  info(msg) {
    msg = `\n[Info]: ${msg}\n`;
    process.stdout.write(chalk.green(msg));
  },
  warn(msg) {
    msg = `\n[Warn]: ${msg}\n`;
    process.stdout.write(chalk.yellow(msg));
  },
  loading(msg) {
    msg = `\n[Loading]: ${msg}\n`;
    process.stdout.write(chalk.white(msg));
  },
  error(err) {
    if (!(err instanceof Error)) {
      err.message && (err = err.message);
      err = new Error(err.message || err.toString());
    }
    if (exports.alert) {
      err.message += "\u0007";
    }

    const msg = `\n[Error]: ${err.message}\n`;
    process.stdout.write(chalk.red(msg));

    process.exit(1);
  },
};

module.exports = log;
