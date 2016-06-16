"use strict";

let config = {};

const developmentConfig = require("./development.json");
config = Object.assign({}, developmentConfig);

// only used for testing purposes
function stubConfig(stub) {
  config = stub;
}

/**
 * Checks to see if a feature is enabled in the config.
 */
function isEnabled(name) {
  return getPath(name, config);
}

/**
 * Gets a config value for a given key
 * e.g "chrome.webSocketPort"
 */
function getValue(key) {
  return getPath(key, config);
}

function isDevelopment() {
  return isEnabled("development");
}

function getPath(path, parentObj) {
  const keys = path.split(".");
  return keys.reduce((obj, key) => obj[key], parentObj);
}

module.exports = {
  isEnabled,
  getValue,
  isDevelopment,
  stubConfig
};
