const firefox = require("./src/firefox");
const chrome = require("./src/chrome");
const { createSource } = require("./src/firefox/create");
const { debugGlobal } = require("./src/utils/debug");
const { Task } = require("./src/utils/task");

let clientType;
function getClient() {
  if (clientType === "chrome") {
    return chrome.clientCommands;
  }

  return firefox.clientCommands;
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
    debugGlobal("client", targetEnv.clientCommands);

    return { tabs, client: targetEnv };
  });
}

function connectClients(onConnect) {
  firefox.connectClient().then(onConnect);
  chrome.connectClient().then(onConnect);
}

module.exports = {
  getClient,
  connectClients,
  startDebugging,
  firefox,
  chrome,
  createSource
};
