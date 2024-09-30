const glob = require("glob");
const path = require("path");
const update = require("../update");

const check = async (name) => {
  let hasProject = false;
  const files = await glob.sync("*", { dot: true });

  hasProject = files.some((f) => {
    return f === name;
  });

  await update();

  if (!hasProject) {
    return Promise.resolve();
  }
  return Promise.reject("项目已存在,创建失败");
};

module.exports = check;
