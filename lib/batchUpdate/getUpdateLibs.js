const { execSync } = require("child_process");
const log = require("../../utils/log");
const { getPackageTxt } = require("../../utils/packages");

const getupdateContent = async (prefix) => {
  let packageTxt = getPackageTxt();
  const reg = new RegExp(`"(${prefix}\/[\\w|-]+)".+,`, "g");
  packageTxt = packageTxt.replace(reg, (_, name) => {
    let version = execSync(`npm view ${name} version`).toString();
    version = version.substring(0, version.length - 1);
    log.info(`${name} => ${version}`);
    return `"${name}": "^${version}",`;
  });

  return packageTxt;
};

module.exports = getupdateContent;
