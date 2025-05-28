const init = require("../lib/init");
const server = require("../lib/server");
const xlsx2Config = require("../lib/locale/xlsx2Config");
const asyncDaml = require("../lib/daml/async");
const asyncDamlByApp = require("../lib/daml/asyncByApp");
const batchUpdate = require("../lib/batchUpdate");

const command = [
  {
    name: "daml",
    alias: "d",
    description: "同步低代码逻辑器文件",
    action: () => {
      asyncDaml();
    },
  },
  {
    name: "batchUpdate",
    alias: "bu",
    description: "批量升级依赖包,可以指定组织,只更新组织下的依赖",
    action: () => {
      batchUpdate();
    },
  },
  {
    name: "damls",
    description: `从应用同步所有页面的逻辑器与变量值,
    可将appId,branchid,token配置到~/.damlrc文件中,
    格式为{"origin":string,"appId":string,"branchid":string,"token":string, "appName": string}[]
    其中origin为请求域名(/api/assembler/page/list(页面列表)接口域名),
    appId,branchid,token为请求参数,
    appName为应用名称,也是你区分不同应用的标识,所有生成的文件都会放在appName文件夹下`,
    alias: "da",
    action: () => {
      asyncDamlByApp();
    },
  },
  {
    name: "init",
    alias: "i",
    description: "项目初始化工具",
    action: (name) => {
      init(name);
    },
  },
  {
    name: "server [path]",
    alias: "s",
    description: "启动本地服务",
    action: server,
    options: {
      端口: "-P, --port <port>",
      https: "-S, --https <boolean>",
    },
    positional: [
      {
        key: "path",
        option: {
          default: "dist",
          describe: "文件路径",
          type: "string",
        },
      },
    ],
  },
  {
    name: "xlsx2Config [path] [name] [ext]",
    alias: "l",
    description: "xlsx文件转多语言配置",
    positional: [
      {
        key: "path",
        option: {
          describe: "文件路径",
          type: "string",
        },
      },
      {
        key: "name",
        option: {
          describe: "xlsx文件名称",
          type: "string",
        },
      },
      {
        key: "ext",
        option: {
          describe: "转换文件格式(ts or json)",
          type: "string",
        },
      },
    ],
    action: xlsx2Config,
  },
];

module.exports = command;
