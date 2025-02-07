const modeOptions = ["pnpm", "yarn", "npm"];

const libBin = {
  pnpm: "pnpm i",
  yarn: "yarn",
  npm: "npm i",
};

const libQuestions = () => [
  {
    type: "list",
    name: "selectMode",
    message: `请选择依赖安装方式`,
    choices: modeOptions,
  },
];

module.exports = { libQuestions, libBin };
