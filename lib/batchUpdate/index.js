const { writePackageTxt } = require("../../utils/packages");
const getupdateContent = require("./getUpdateLibs");
const Prompt = require("inquirer");

const batchUpdate = async () => {
  const quetionList = [
    {
      type: "input",
      name: "prefix",
      message: "请输入需要更新的包组织,如只更新@wagq,输入@wagq",
      default: "@wagq",
    },
  ];

  const { prefix } = await Prompt.default.prompt(quetionList);
  const packageContent = await getupdateContent(prefix);
  writePackageTxt(packageContent);
};

module.exports = batchUpdate;
