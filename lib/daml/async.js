const fs = require("fs");
const Prompt = require("inquirer");
const log = require("../../utils/log");
const string2Data = require("../../utils/string2Data");

const typePath = {
  "逻辑编辑器": "actions.actionList",
  "变量编辑器": "dataSource.dataList",
  "变量与逻辑": "变量与逻辑"
}

const initQuestions = () => [
  {
    type: "input",
    name: "name",
    message: "请输入备注信息(会将所有逻辑编辑器文件保存在这个文件夹里,默认值是asyncData)",
    default: "asyncData"
  },
  {
    type: "list",
    name: "type",
    message: "请选择同步数据类型",
    choices: Reflect.ownKeys(typePath)
  }
];

const getFiles = async () => {
  const fnFile = await fs.existsSync(
    `${process.cwd()}/scripts/asyncDamlFetch.js`
  );
  if (!fnFile) {
    const hasCatalogue = await fs.existsSync(`${process.cwd()}/scripts`);
    if(!hasCatalogue){
      await fs.mkdirSync("scripts", undefined, {
        cwd: process.cwd(),
      });
    }
    await fs.writeFileSync(`${process.cwd()}/scripts/asyncDamlFetch.js`, '')
    log.error("scripts/asyncDamlFetch.js文件不存在, 已为您创建scripts/asyncDamlFetch.js文件，请将您的逻辑编辑器代码复制到该文件中后再次执行")
    return;
  }
  const fetchDaml = await require(`${process.cwd()}/scripts/asyncDamlFetch.js`);

  const { name, type } = await Prompt.default.prompt(initQuestions());
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
      try{
        const daml = JSON.parse(res.data.daml);
        const pages = daml.app.subapps[0].actions.actionList || [];
        const variables = daml.app.subapps[0].dataSource.dataList || [];

        let asyncPage = false
        let asyncVariable = false

        switch (type) {
          case "逻辑编辑器":
            asyncPage = true
            break;
          case "变量编辑器":
            asyncVariable = true
            break;
          case "变量与逻辑":
            asyncPage = true
            asyncVariable = true
            break;
        }
        if(asyncPage) {
          pages.forEach(({ content, name: fileName }) => {
            fs.writeFileSync(`${name}/${fileName}.js`, content, {
              cwd: process.cwd(),
            });
          });
        }
        if(asyncVariable) {
          variables.forEach(({ key, value: variableValue }) => {
            fs.writeFileSync(`${name}/${key}.json`, JSON.stringify(variableValue, (key, value) => {
              if (typeof value === "string") {
                return string2Data(value);
              }
              return value;
            }, 2) , {
              cwd: process.cwd(),
            });
          });
        }
      }
      catch(err) {
        log.error("解析daml失败,请检查请求是否过期或无法访问")
      }
    }).catch(err => {
      log.error("请求daml失败,请检查daml是否过期或无法访问")
    });
};

module.exports = getFiles;
