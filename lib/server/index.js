const { spawn } = require("node:child_process"); // 使用 node: 前缀明确使用核心模块
const Prompt = require("inquirer");
const { resolve } = require("node:path");
const path = require("node:path");

// 可以在https://www.toolhelper.cn/SSL/SSLGenerate生成
const sslQuestions = () => [
  {
    type: "input",
    name: "cert",
    message: `证书地址(完整的绝对路径,不填使用cli自导带证书)`,
  },
  {
    type: "input",
    name: "private",
    message: `私钥地址(完整的绝对路径,不填使用cli自导带证书)`,
  },
];

const server = async (filePath, argv) => {
  const https = argv.https ?? false;
  const port = argv.port ?? 3000;

  const currentFilePath = __dirname;

  try {
    const args = [filePath, "-p", port.toString()];
    if (https === "true") {
      const { cert, private } = await Prompt.default.prompt(sslQuestions());
      args.push(
        "-S",
        "-C",
        `${cert || resolve(currentFilePath, "./ssl/cert.pem")}`,
        "-K",
        `${private || resolve(currentFilePath, "./ssl/key.pem")}`
      );
    }

    const dirPath = resolve(currentFilePath, "../../");

    const child = spawn(
      `${dirPath}\\node_modules\\.bin\\http-server ${args.join(` `)}`,
      null,
      {
        cwd: process.cwd(),
        stdio: "inherit",
        shell: true,
      }
    );

    child.on("close", (code) => process.exit(code));
  } catch (error) {
    console.error("启动失败:", error.message);
  }
};

module.exports = server;
