const modeOptions = ["npm", "yarn", "pnpm"];

const libBin = {
  npm: "npm i",
  yarn: "yarn",
  pnpm: "pnpm i",
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
