const Prompt = require("inquirer");

const clone = require("../clone/index.js");
const check = require("./check.js");
const log = require("../../utils/log.js");
const after = require("./after.js");
const { execSync } = require("child_process");

const viteBin = "npm create vite@latest";
const uniAppBin = "npm create unibest";
const rnAppBin = "npx create-expo-app --template";

const urls = {
  vue单页面后台: { remote: "sdmu-gaoqi/vite-vue" },
  vue多页面项目: { remote: "sdmu-gaoqi/vite-vue-multiple" },
  React: { key: "react" },
  vite: { bin: viteBin },
  "uniapp(unibest)": { bin: uniAppBin },
  "vscode插件-vue版": { remote: "sdmu-gaoqi/vscode-plugin#vue" },
  "vscode插件-react版": { remote: "sdmu-gaoqi/vscode-plugin#react" },
  umi: { bin: "npx create-umi@latest" },
  "react-native": { bin: rnAppBin },
};

const reactRepoMap = {
  SPA: {
    remote: "direct:https://gitee.com/wa_6/template-vite-react.git#template",
  },
  微前端基座: {
    remote: "direct:https://gitee.com/GQ-og/templat-qk-main.git#template",
  },
  微前端子应用: {
    remote: "direct:https://gitee.com/GQ-og/template-qk-module.git#template",
  },
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
  },
]; // 项目nam

const reactOptions = [
  {
    type: "list",
    name: "reactMode",
    message: `请选择分支`,
    choices: Object.keys(reactRepoMap),
  },
];

const init = async () => {
  try {
    const { selectMode } = await Prompt.default.prompt(initQuestions());
    const { remote, bin, key } = urls?.[selectMode];
    let repoRemote = remote;
    const isReact = key === "react";
    const needName = !!remote || isReact;
    const cloneOptions = {};

    if (isReact) {
      const { reactMode } = await Prompt.default.prompt(reactOptions);
      repoRemote = reactRepoMap[reactMode].remote;
      cloneOptions.clone = true;
    }

    if (needName) {
      const { libraryName } = await Prompt.default.prompt(nameOptions());
      if (!repoRemote) {
        log.error("仓库正在建设中,请先选择其他模板");
      }
      await check(libraryName);
      await clone(repoRemote, libraryName, cloneOptions);
      await after(libraryName, selectMode);
    } else {
      const info = `准备从${selectMode}创建`;
      log.info(info);
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
