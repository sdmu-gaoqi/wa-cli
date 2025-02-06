const init = require("../lib/init");
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
