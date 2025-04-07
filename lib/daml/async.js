const fs = require("fs");
const Prompt = require("inquirer");
const log = require("../../utils/log");

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
    log.error("scripts/asyncDamlFetch.js文件不存在")
    const hasCatalogue = await fs.existsSync(`${process.cwd()}/scripts`);
    if(!hasCatalogue){
      await fs.mkdirSync("scripts", undefined, {
        cwd: process.cwd(),
      });
    }
    await fs.writeFileSync(`${process.cwd()}/scripts/asyncDamlFetch.js`)
    log.info("已为您创建scripts/asyncDamlFetch.js文件，请将您的逻辑编辑器代码复制到该文件中后再次执行")
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
