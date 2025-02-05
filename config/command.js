const init = require("../lib/init");

const command = [
  {
    name: "init",
    alias: "i",
    description: "项目初始化工具",
    action: (name) => {
      init(name);
    },
  },
];

module.exports = command;
