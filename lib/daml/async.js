const fs = require("fs");
const Prompt = require("inquirer");

const initQuestions = () => [
  {
    type: "input",
    name: "name",
    message: "请输入备注信息(会将所有逻辑编辑器文件保存在这个文件夹里)",
  },
];

const getFiles = async () => {
  const fnFile = await fs.existsSync(
    `${process.cwd()}/scripts/asyncDamlFetch.js`
  );
  if (!fnFile) {
    console.log("scripts/asyncDamlFetch.js文件不存在");
    return;
  }
  const fetchDaml = await require(`${process.cwd()}/scripts/asyncDamlFetch.js`);

  const { name } = await Prompt.default.prompt(initQuestions());
  const exist = await fs.existsSync(name);
  if (!exist) {
    await fs.mkdirSync(String(name), undefined, {
      cwd: process.cwd(),
    });
  }

  fetchDaml()
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      const daml = JSON.parse(res.data.daml);
      const pages = daml.app.subapps[0].actions.actionList;

      pages.forEach(({ content, name: fileName }) => {
        fs.writeFileSync(`${name}/${fileName}.js`, content, {
          cwd: process.cwd(),
        });
      });
    });
};

module.exports = getFiles;
