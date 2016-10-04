"use strict";

const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const set = require("lodash/set");

const firefoxPanel = require("./firefox-panel.json");
const development = require("./development.json");
const envConfig = process.env.TARGET === "firefox-panel" ?
   firefoxPanel : development;

const localConfigPath = path.join(__dirname, "./local.json");
const localConfigExists = fs.existsSync(localConfigPath);

let config;
let localConfig;

if (process.env.TARGET === "firefox-panel") {
  config = firefoxPanel;
} else {
  localConfig = localConfigExists ? require("./local.json") : {};

  config = _.merge({}, envConfig, localConfig);
}

function updateLocalConfig(configPath, value) {
  if (!localConfigExists) {
    return;
  }

  const newConfig = set(localConfig, configPath, value);
  fs.writeFileSync(localConfigPath, JSON.stringify(localConfig, null, "  "));
  return newConfig;
}

function getConfig() {
  return config;
}

module.exports = {
  getConfig,
  updateLocalConfig
};
