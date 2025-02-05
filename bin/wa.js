#!/usr/bin/env node
const { program } = require("commander");

const packageJson = require("../package.json");
const init = require("../lib/init/index.js");

program.version(packageJson.version);

program
  .command("init")
  .alias("i")
  .description("vue admin 项目初始化工具")
  .action((name) => {
    init(name);
  });

program.parse(process.argv);
