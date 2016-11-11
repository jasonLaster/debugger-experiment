const _ = require("lodash");
const fs = require("fs");

function getConfig() {
  const firefoxConfig = require("../configs/firefox-panel.json");
  const developmentConfig = require("../configs/development.json");
  const localConfigPath = "../configs/local.json";
  const localConfig = fs.existsSync(localConfigPath) ? require(localConfigPath) : {};

  if (process.env.TARGET === "firefox-panel") {
    return firefoxConfig;
  }

  const envConfig = process.env.TARGET === "firefox-panel" ?
                  firefoxConfig : developmentConfig;

  return _.merge({}, envConfig, localConfig);
}

module.exports = getConfig;
