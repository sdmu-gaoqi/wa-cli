const { spawn } = require("child_process");
const Prompt = require("inquirer");

const skill = async () => {
  const initQuestions = () => [
    {
      type: "list",
      name: "mode",
      message: `请选择指令`,
      choices: ["getList", "sync"],
    },
  ];

  const commandConfig = {
    getList: "npx openskills install anthropics/skills",
    sync: "npx openskills sync"
  }

  const { mode } = await Prompt.default.prompt(initQuestions());

  const command = commandConfig[mode];

  if(command) {
    spawn(
      `${command}`,
      {
        cwd: process.cwd(),
        stdio: "inherit",
        shell: true,
      },
    );
  }
};

module.exports = skill;
