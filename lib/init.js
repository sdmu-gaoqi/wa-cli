const chalk = require("chalk");
const Prompt = require("inquirer");

const clone = require("./clone");

const modeOptions = ["vue单页面后台"];
const urls = new Map();
urls.set(
  "vue单页面后台",
  "https://github.com/sdmu-gaoqi/vite-vue/tree/template"
);

const initQuestions = (name) => [
  {
    type: "confirm",
    name: "isInit",
    message: `确定要在${chalk.green(name)}文件夹下创建项目?`,
    prefix: "?",
  },
  {
    type: "list",
    name: "selectMode",
    message: `请选择模板`,
    choices: modeOptions,
  },
];

const init = async (name) => {
  try {
    const { isInit, selectMode } = await Prompt.prompt(initQuestions(name));
    if (isInit) {
      const remote = urls.get(selectMode);
      if (!remote) {
        throw new Error(`未找到${selectMode}模板`);
      }
      await clone(remote, name);
    } else {
      console.log(chalk.red("程序提前结束"));
    }
  } catch (error) {
    console.log(chalk.red(error));
  }
};

module.exports = init;
