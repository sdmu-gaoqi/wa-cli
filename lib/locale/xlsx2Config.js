const xlsx = require("xlsx");
const fs = require("fs");

const xlsx2Config = async (path, name, ext) => {
  try {
    const file = xlsx.readFile(`${path}/${name}`);
    const sheetNames = file.SheetNames; // 返回 ['sheet1', 'sheet2']
    const l10n = {};
    for (const sheetName of sheetNames) {
      const jsonData = xlsx.utils.sheet_to_json(file.Sheets[sheetName]);
      const fields = Object.keys(jsonData[0]);
      jsonData.forEach((word) => {
        // 0 是 key
        for (let index = 1; index < fields.length; index++) {
          const field = fields[index];
          if (!l10n[field]) {
            l10n[field] = {};
          }
          l10n[field][word.key] =
            String(word[field || "zh-CN"] || word.key) || "";
        }
      });

      Object.keys(l10n).forEach((key) => {
        const content = JSON.stringify(l10n[key], null, 2);
        const str = `export default ${content}\n`;
        const writePath = `${path}/${key}.${ext}`;
        fs.writeFileSync(writePath, ext === "json" ? content : str, "utf8");
      });
    }
  } catch (err) {
    console.log(err, "文件转换失败");
  }
};

module.exports = xlsx2Config;
