const { Task } = require("../utils/task");
const firefox = require("./firefox");
const chrome = require("./chrome");
const { debugGlobal } = require("../utils/debug");
const transform = require("lodash/transform");

let clientType;

let _clientCommands;

function getClient() {
  if (_clientCommands) {
    return _clientCommands;
  }

  const commands = clientType === "chrome"
        ? chrome.clientCommands : firefox.clientCommands;

  function command(command) {
    return async function() {
      const args = [...arguments];
      const response = await commands[command](...args);
      window.clientCommandLog.push({ command, args, response });
      return response;
    };
  }

  _clientCommands = transform(commands, (result, value, key) => {
    result[key] = command(key);
  });
  return _clientCommands;
}

function startDebugging(connTarget, actions) {
  if (connTarget.type === "node") {
    return startDebuggingNode(connTarget.param, actions);
  }

  const target = connTarget.type === "chrome" ? chrome : firefox;
  return startDebuggingTab(target, connTarget.param, actions);
}

function startDebuggingNode(url, actions) {
  clientType = "chrome";
  return chrome.connectNode(`ws://${url}`).then(() => {
    chrome.initPage(actions);
  });
}

function startDebuggingTab(targetEnv, tabId, actions) {
  return Task.spawn(function* () {
    const tabs = yield targetEnv.connectClient();
    const tab = tabs.find(t => t.id.indexOf(tabId) !== -1);
    yield targetEnv.connectTab(tab.tab);
    targetEnv.initPage(actions);

    clientType = targetEnv === firefox ? "firefox" : "chrome";
    debugGlobal("clientEventLog", []);
    debugGlobal("clientCommandLog", []);
    debugGlobal("clientCommands", targetEnv.clientCommands);

    return tabs;
  });
}

function connectClients() {
  return Promise.all([
    firefox.connectClient(),
    chrome.connectClient()
  ]).then(results => {
    const [firefoxTabs, chromeTabs] = results;
    return firefoxTabs.concat(chromeTabs).filter(i => i);
  });
}

module.exports = {
  getClient,
  connectClients,
  startDebugging
};
