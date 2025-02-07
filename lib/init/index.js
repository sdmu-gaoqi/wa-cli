const Prompt = require("inquirer");

const clone = require("../clone/index.js");
const check = require("./check.js");
const log = require("../../utils/log.js");
const after = require("./after.js");
const { execSync } = require("child_process");

const urls = {
  vue单页面后台: { remote: "sdmu-gaoqi/vite-vue" },
  vue多页面项目: { remote: "sdmu-gaoqi/vite-vue-multiple" },
  vite: { bin: "npm create vite@latest" },
  "vscode插件-vue版": { remote: "sdmu-gaoqi/vscode-plugin#vue" },
  "vscode插件-react版": { remote: "sdmu-gaoqi/vscode-plugin#react" },
};
const modeOptions = Object.keys(urls);

const initQuestions = () => [
  {
    type: "list",
    name: "selectMode",
    message: `请选择模板`,
    choices: modeOptions,
  },
  {
    type: "input",
    name: "name",
    message: `请输入项目名`,
    choices: modeOptions,
  },
];

const init = async () => {
  try {
    const { name, selectMode } = await Prompt.default.prompt(initQuestions());
    if (name) {
      const { remote, bin } = urls?.[selectMode];
      await check(name);

      const initByVite = bin;

      if (initByVite) {
        log.info("准备从vite创建");
        execSync(`${bin} ${name}`, {
          stdio: "inherit",
          cwd: process.cwd(),
          shell: true,
        });
      } else {
        if (!remote) {
          throw new Error(`未找到${selectMode}模板`);
        }
        await clone(remote, name);
        await after(name, selectMode);
      }
    } else {
      log.info("程序提前结束");
    }
  } catch (error) {
    log.error(error);
  }
};

module.exports = init;
