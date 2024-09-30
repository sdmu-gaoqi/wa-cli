const { promisify } = require("util");
const ora = require("ora");
const chalk = require("chalk");
const download = promisify(require("download-git-repo"));

const clone = async function (repo, dir, opotions = {}) {
  const process = ora(`开始下载 ${chalk.blue(repo)}`);
  process.start();
  process.color = "yellow";
  process.text = `正在下载..... ${chalk.yellow(repo)} `;

  try {
    await download(repo, dir, opotions);
    process.color = "green";
    process.succeed("下载成功");
  } catch (error) {
    process.color = "red";
    console.log(error);
    process.fail("下载失败");
  }
};

module.exports = clone;
