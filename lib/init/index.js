const Prompt = require("inquirer");

const clone = require("../clone/index.js");
const check = require("./check.js");
const log = require("../../utils/log.js");
const after = require("./after.js");
const { execSync } = require("child_process");

const viteBin = "npm create vite@latest";
const uniAppBin = "npm create unibest";

const urls = {
  vue单页面后台: { remote: "sdmu-gaoqi/vite-vue" },
  vue多页面项目: { remote: "sdmu-gaoqi/vite-vue-multiple" },
  vite: { bin: viteBin },
  'uniapp(unibest)': { bin: uniAppBin },
  "vscode插件-vue版": { remote: "sdmu-gaoqi/vscode-plugin#vue" },
  "vscode插件-react版": { remote: "sdmu-gaoqi/vscode-plugin#react" },
  'umi': { bin: 'npx create-umi@latest' }
};
const modeOptions = Object.keys(urls);

const initQuestions = () => [
  {
    type: "list",
    name: "selectMode",
    message: `请选择模板`,
    choices: modeOptions,
  },
];

const nameOptions = () => [
  {
    type: "input",
    name: "libraryName",
    message: `请输入项目名`,
  }
] // 项目nam

const init = async () => {
  try {
    const { selectMode } = await Prompt.default.prompt(initQuestions());
    const { remote, bin } = urls?.[selectMode];
    const needName = !!remote

    if(needName) {
      const { libraryName } = await Prompt.default.prompt(nameOptions());
      await check(libraryName);
      await clone(remote, libraryName);
      await after(libraryName, selectMode);
    }
    else {
      const info = `准备从${selectMode}创建`
      log.info(info)
      execSync(bin, {
        stdio: "inherit",
        cwd: process.cwd(),
        shell: true,
      });
    }
  } catch (error) {
    log.error(error);
  }
};

module.exports = init;
