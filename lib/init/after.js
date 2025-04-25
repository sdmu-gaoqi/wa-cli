const fs = require("fs");
const path = require("path");
const log = require("../../utils/log");
const { execSync } = require("child_process");
const ora = require("ora");
const { libQuestions, libBin } = require("../../config/lib");
const Prompt = require("inquirer");

const cmdPath = process.cwd();

const changeProjectInfo = async (packageName) => {
  const cwd = process.cwd();
  const packagePath = path.join(`${cwd}/${packageName}`, "package.json");
  const packageContent = fs.readFileSync(packagePath, "utf-8");
  const packageInfo = JSON.parse(packageContent);
  packageInfo.name = packageName;
  const readmePath = path.join(`${cwd}/${packageName}`, "README.md");
  const readmeContent = fs.readFileSync(readmePath, "utf-8");
  const newReadmeContent = readmeContent.replace("<%= project %>", packageName);

  await fs.writeFileSync(
    packagePath,
    JSON.stringify(packageInfo, null, "  ") + "\n"
  );
  await fs.writeFileSync(readmePath, newReadmeContent);
};

const initGit = async (packageName) => {
  const execConfig = { cwd: `${cmdPath}/${packageName}` };
  await execSync("git init -b main", execConfig);
};

const initHusky = (packageName) => {
  const execConfig = { cwd: `${cmdPath}/${packageName}` };
  log.info("初始化Husky中...");
  try {
    execSync("npx --no-install husky install", {
      cwd: `${cmdPath}/${packageName}`,
    });
  } catch (error) {
    log.error("Husky 命令安装失败: \n" + error);
  }
  try {
    execSync('echo "npx lint-staged" > .husky/pre-commit', execConfig);
    execSync(
      'echo "npx --no -- commitlint --edit ${1}" > .husky/commit-msg',
      execConfig
    );
    log.info(`Husky 初始化完成, 可打开${packageName}查看`);
  } catch (error) {
    log.error("Husky 命令写入失败: \n" + error);
  }
};

const firstCommit = async (packageName) => {
  const execConfig = { cwd: `${cmdPath}/${packageName}` };
  await execSync("git init", execConfig);
  await execSync("git add .", execConfig);
  await execSync(`git commit -m "feat: 初始化项目" --no-verify`, execConfig);
};

const installLibrary = async (packageName) => {
  const { selectMode } = await Prompt.default.prompt(libQuestions());
  const bin = libBin[selectMode];
  const process = ora("安装依赖中...");
  process.start();
  process.color = "green";
  await execSync(bin, {
    cwd: `${cmdPath}/${packageName}`,
  });
  process.succeed("依赖安装完成");
};

const after = async (name) => {
  const packageName = name;
  changeProjectInfo(name);
  await initGit(packageName);
  await installLibrary(packageName);
  await initHusky(packageName);
  await firstCommit(packageName);
};

module.exports = after;
