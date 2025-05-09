const fs = require("fs");
const Prompt = require("inquirer");
const log = require("../../utils/log");
const string2Data = require("../../utils/string2Data");
const prettier = require("../../node_modules/prettier");

const catalogue = "pages";

const initQuestions = () => [
  {
    type: "list",
    name: "ignore",
    message: "git是否忽略当前目录",
    choices: [true, false],
    default: true,
  },
];

const handleIgnore = async (ignore, catalogue) => {
  try {
    if (ignore) {
      const ignoreExist = await fs.existsSync(`${process.cwd()}/.gitignore`);
      if (!ignoreExist) {
        await fs.writeFileSync(`.gitignore`, `${catalogue}`, {
          cwd: process.cwd(),
        });
      } else {
        const hasCatalogue = await fs
          .readFileSync(`${process.cwd()}/.gitignore`)
          .toString()
          .includes(catalogue);
        if (!hasCatalogue) {
          await fs.appendFileSync(
            `${process.cwd()}/.gitignore`,
            `\n${catalogue}`
          );
        }
      }
    }

    return Promise.resolve();
  } finally {
    return Promise.resolve();
  }
};

const getList = async (origin, appId, branchid, token) => {
  try {
    const request = () =>
      fetch(`${origin}/api/assembler/page/list`, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language":
            "zh,ja;q=0.9,zh-CN;q=0.8,en;q=0.7,ko;q=0.6,vi;q=0.5,zh-TW;q=0.4",
          "access-token": token,
          appid: appId,
          branchid: branchid,
          "cache-control": "no-cache",
          "content-type": "application/json",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        body: `{"current":1,"size":1000,"name":"","path":"","type":"","appId":${appId}}`,
        method: "POST",
      });
    const res = await request().then((res) => res.json());

    const lists = res.data.records.map((i) => {
      return {
        id: i.id,
        name: `${i.name}(${i.path.replace(/\//g, "_")})`,
      };
    });

    return lists || [];
  } catch (err) {
    log.error(
      `请求页面列表失败,请检查参数是否正确, origin:${origin}, appId: ${appId}, branchid: ${branchid}, token: ${token}`
    );
  }
};

const getDaml = async (lists, origin, appId, branchid, token, dirName) => {
  try {
    lists.forEach(async ({ name, id }) => {
      const request = () =>
        fetch(`${origin}/api/assembler/page/getPageDaml`, {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language":
              "zh,ja;q=0.9,zh-CN;q=0.8,en;q=0.7,ko;q=0.6,vi;q=0.5,zh-TW;q=0.4",
            "access-token": token,
            appid: appId,
            branchid: branchid,
            "cache-control": "no-cache",
            "content-type": "application/json",
            pragma: "no-cache",
            "sec-ch-ua":
              '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            cookie: "_tea_utm_cache_1229=undefined",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          body: `{\"pageId\":\"${id}\",\"appId\":\"${appId}\"}`,
          method: "POST",
        });

      log.loading(`正在同步${name}的逻辑器与变量值`);
      request()
        .then((res) => res.json())
        .then(async (res) => {
          const daml = JSON.parse(res.data.daml);
          await generateLogic(dirName, daml, name);
          await generateVariable(dirName, daml, name);
        });
    });
  } catch (err) {
    log.error(err);
  }
};

const addJsDoc = (content, name, fileName) => {
  const hasFileJsDoc = content.includes("@file");
  // 添加标识
  return hasFileJsDoc
    ? content
    : `/** @file ${name}(逻辑名称:${fileName}) */
    
    
    /**
     * @type {import("../../../../sass").CustomAction}
     */
    ${content}`;
};

const formatContent = async (content, filepath) => {
  try {
    const config = await prettier.resolveConfig("path/to/file", {
      useCache: false,
    });
    content = await prettier.format(content, {
      ...config,
      semi: false,
      filepath,
    });
    return content;
  } catch (err) {
    return content;
  }
};

const generateLogic = async (dirName, daml, name) => {
  try {
    log.loading(`正在同步${name}的逻辑器`);
    const logicDir = `${dirName}/${name}/logic`;
    // 创建逻辑器文件夹
    await fs.mkdirSync(
      `${logicDir}`,
      { recursive: true },
      {
        cwd: process.cwd(),
      }
    );
    const pages = daml.app.subapps[0]?.actions?.actionList || [];
    pages.forEach(async ({ content, name: fileName }) => {
      const filePath = `${logicDir}/${fileName}.js`;
      // 添加标识
      content = addJsDoc(content, name, fileName);
      // 格式化
      content = await formatContent(content, filePath);

      fs.writeFileSync(filePath, content, {
        cwd: process.cwd(),
      });
    });
    log.info(`同步${name}的逻辑器成功`);
  } catch (err) {
    log.loading(`同步${name}的逻辑器失败:${err}`);
  }
};

const generateVariable = async (dirName, daml, name) => {
  try {
    log.loading(`正在同步${name}的变量值`);
    const variableDir = `${dirName}/${name}/variable`;
    // 创建变量文件夹
    await fs.mkdirSync(
      `${variableDir}`,
      { recursive: true },
      {
        cwd: process.cwd(),
      }
    );

    const variables = daml.app.subapps[0].dataSource.dataList || [];

    variables.forEach(({ key, value: variableValue }) => {
      fs.writeFileSync(
        `${variableDir}/${key}.json`,
        JSON.stringify(
          variableValue,
          (key, value) => {
            if (typeof value === "string") {
              return string2Data(value);
            }
            return value;
          },
          2
        ),
        {
          cwd: process.cwd(),
        }
      );
    });
    log.info(`同步${name}的变量值成功`);
  } catch (err) {
    log.loading(`同步${name}的变量失败:${err}`);
  }
};

const checkDamlrc = async () => {
  const exist = await fs.existsSync(`${process.cwd()}/.damlrc.json`);
  if (!exist) {
    log.loading(`
      检测到.damlrc文件不存在, 
      正在为你创建所需文件,
    `);
    await fs.writeFileSync(
      `${process.cwd()}/.damlrc.json`,
      `
        [
            {
                "appName": "应用名称",
                "origin": "低代码域名",
                "appId": "应用id",
                "branchid": "应用分支id",
                "token": "你的token"
            }
        ]
        `
    );
    log.error("文件创建成功,请打开.damlrc.json补充你的信息后再次执行命令");
  }
  return;
};

const main = async () => {
  await checkDamlrc();
  const settings = require(`${process.cwd()}/.damlrc.json`) || [];
  const { ignore } = await Prompt.default.prompt(initQuestions());
  settings.forEach(async ({ appName, origin, token, appId, branchid }) => {
    const basePath = `${appName}/${catalogue}`;
    const exist = await fs.existsSync(basePath);

    if (!exist) {
      log.info(`当前目录${basePath}不存在,开始创建${basePath}文件夹`);
      const hasTopDir = await fs.existsSync(appName);
      if (!hasTopDir) {
        await fs.mkdirSync(String(appName), undefined, {
          cwd: process.cwd(),
        });
      }
      await fs.mkdirSync(String(basePath), undefined, {
        cwd: process.cwd(),
      });
    }

    await handleIgnore(ignore, basePath);
    const lists = await getList(origin, appId, branchid, token);
    log.info(`请求${appName}页面列表成功,条数为${lists.length}`);
    await getDaml(lists, origin, appId, branchid, token, basePath);
  });
};

module.exports = main;
