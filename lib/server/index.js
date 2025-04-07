const { spawn } = require('node:child_process'); // 使用 node: 前缀明确使用核心模块

const server = (filePath, argv) => {
  const https = argv.https ?? false;
  const port = argv.port ?? 3000;

  try {
    const args = [filePath, '-p', port.toString()];
    if (https) {
      args.push('-S', '-C', 'cert.pem', '-K', 'key.pem');
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
