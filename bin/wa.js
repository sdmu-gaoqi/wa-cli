#!/usr/bin/env node
const { program } = require("commander");

const packageJson = require("../package.json");
const init = require("../lib/init/index.js");
const command = require("../config/command.js");

program.version(packageJson.version);

command.forEach((item) => {
  program
    .command(item.name)
    .alias(item.alias)
    .description(item.description)
    .action(item.action);
});

program.parse(process.argv);
