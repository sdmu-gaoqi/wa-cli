const init = require("../lib/init");
const server = require("../lib/server");
const xlsx2Config = require("../lib/locale/xlsx2Config");

const command = [
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
