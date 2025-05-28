const fs = require("fs");

const getPackageInfo = () => {
  const packageJson = require("./package.json");
  return packageJson;
};

const getPackageTxt = () => {
  return fs.readFileSync("./package.json", "utf-8");
};

const writePackageTxt = (content) => {
  return fs.writeFileSync("./package.json", content, "utf-8");
};

module.exports = {
  getPackageInfo,
  getPackageTxt,
  writePackageTxt,
};
