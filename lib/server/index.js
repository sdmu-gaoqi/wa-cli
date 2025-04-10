const { spawn } = require('node:child_process'); // 使用 node: 前缀明确使用核心模块
const Prompt = require("inquirer");

// 可以在https://www.toolhelper.cn/SSL/SSLGenerate生成
const sslQuestions = () => [
  {
    type: "input",
    name: "cert",
    default: "cert.pem",
    message: `证书地址(完整的绝对路径)`,
  },
  {
    type: "input",
    name: "private",
    default: "private.key",
    message: `私钥地址(完整的绝对路径)`,
  },
];

const server = async(filePath, argv) => {
  const https = argv.https ?? false;
  const port = argv.port ?? 3000;

  try {
    const args = [filePath, '-p', port.toString()];
    if (https) {
      const { cert, private } = await Prompt.default.prompt(sslQuestions());
      args.push('-S', '-C', `${cert}`, '-K', `${private}`);
    }
    
    const child = spawn('npx', ['http-server', ...args], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => process.exit(code));
  } catch (error) {
    console.error('启动失败:', error.message);
  }
};

module.exports = server;
