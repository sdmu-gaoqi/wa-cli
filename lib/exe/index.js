const { execSync } = require("child_process");

const web2exe = (name, path) => {
    execSync(`npx nativefier ${name} ${path}`)
}

module.exports = web2exe
