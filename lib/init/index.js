const Prompt = require("inquirer");

const clone = require("../clone/index.js");
const check = require("./check.js");
const log = require("../../utils/log.js");
const after = require("./after.js");

const modeOptions = ["vue单页面后台"];
const urls = new Map();
urls.set("vue单页面后台", "sdmu-gaoqi/vite-vue#template");

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
    const { name, selectMode } = await Prompt.prompt(initQuestions());
    if (name) {
      const remote = urls.get(selectMode);
      await check(name);

      if (!remote) {
        throw new Error(`未找到${selectMode}模板`);
      }

      await clone(remote, name);
      await after(name, selectMode);
    } else {
      log.info("程序提前结束");
    }
  } catch (error) {
    log.error(error);
  }
};

module.exports = init;
