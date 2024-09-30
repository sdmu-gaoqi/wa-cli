const { exec } = require("child_process");
const config = require("../../package.json");
const { compareVersions } = require("compare-versions");
const log = require("../../utils/log");
const ora = require("ora");

module.exports = (argv) => {
  const cmd = `npm view ${config.name} version --json --registry=http://registry.npmjs.org`;
  const shellUpdate = argv && argv._ && argv._[0] === "update";
  return new Promise((resolve, reject) => {
    exec(cmd, (error, info) => {
      if (error) {
        reject();
        log.error(`${config.name} 信息获取失败， 请尝试在命令前加入sudo`);
      }
      info = info.trim();
      const version = info.substring(1, info.length - 1);
      // 1: 当前版本大于等于最新版本 0: 当前版本等于最新版本 -1: 当前版本小于最新版本
      const compareResult = compareVersions(config.version, version);
      if (compareResult == 1 || compareResult == 0) {
        if (shellUpdate) {
          // shell 执行的,给个信息提示,引入执行不需要
          log.info(`${config.name}@${config.version} 已最新`);
        }

        resolve({
          needUpdate: false,
        });
      } else {
        log.warn(`${config.name} 需要更新`);
        const spinner = ora(`${config.name} 更新中......`).start();
        const run = `npm install -g ${config.name}@latest --registry=http://registry.npmjs.org`;
        exec(run, (err) => {
          if (err) {
            reject();
            log.error(err);
          }
          if (!shellUpdate) {
            log.info(`${config.name}版本更新,当前版本: ${version}`);
          } else {
            spinner.succeed(`${config.name} 更新结束,当前版本: ${version}`);
          }
          resolve({
            needUpdate: true,
          });
        });
      }
    });
  });
};
