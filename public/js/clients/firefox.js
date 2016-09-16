const { DebuggerClient } = require("devtools-sham/shared/client/main");
const { DebuggerTransport } = require("devtools-sham/transport/transport");
const WebSocketDebuggerTransport = require("devtools/shared/transport/websocket-transport");
const { TargetFactory } = require("devtools-sham/client/framework/target");
const defer = require("../utils/defer");
const { getValue } = require("../feature");
const { Tab } = require("../types");
const { setupCommands, clientCommands } = require("./firefox/commands");
const { setupEvents, clientEvents } = require("./firefox/events");

let debuggerClient = null;
let threadClient = null;
let tabTarget = null;

function getThreadClient() {
  return threadClient;
}

function setThreadClient(client) {
  threadClient = client;
}

function getTabTarget() {
  return tabTarget;
}

function setTabTarget(target) {
  tabTarget = target;
}

function lookupTabTarget(tab) {
  const options = { client: debuggerClient, form: tab, chrome: false };
  return TargetFactory.forRemoteTab(options);
}

function createTabs(tabs) {
  return tabs.map(tab => {
    return Tab({
      title: tab.title,
      url: tab.url,
      id: tab.actor,
      tab,
      browser: "firefox"
    });
  });
}

function connectClient() {
  const deferred = defer();
  const useProxy = !getValue("firefox.webSocketConnection");
  const portPref = useProxy ? "firefox.proxyPort" : "firefox.webSocketPort";
  const webSocketPort = getValue(portPref);

  const socket = new WebSocket(`ws://${document.location.hostname}:${webSocketPort}`);
  const transport = useProxy ?
    new DebuggerTransport(socket) : new WebSocketDebuggerTransport(socket);
  debuggerClient = new DebuggerClient(transport);

  debuggerClient.connect().then(() => {
    return debuggerClient.listTabs().then(response => {
      deferred.resolve(createTabs(response.tabs));
    });
  }).catch(err => {
    console.log(err);
    deferred.reject();
  });

  return deferred.promise;
}

function connectTab(tab) {
  return new Promise((resolve, reject) => {
    window.addEventListener("beforeunload", () => {
      getTabTarget() && getTabTarget().destroy();
    });

    lookupTabTarget(tab).then(target => {
      tabTarget = target;
      target.activeTab.attachThread({}, (res, _threadClient) => {
        threadClient = _threadClient;
        threadClient.resume();
        resolve();
      });
    });
  });
}

function initPage(actions) {
  tabTarget = getTabTarget();
  threadClient = getThreadClient();

  setupCommands({ threadClient, tabTarget, debuggerClient });

  tabTarget.on("will-navigate", actions.willNavigate);
  tabTarget.on("navigate", actions.navigated);

  // Listen to all the requested events.
  setupEvents({ threadClient, actions });
  Object.keys(clientEvents).forEach(eventName => {
    threadClient.addListener(eventName, clientEvents[eventName]);
  });

  // In Firefox, we need to initially request all of the sources. In
  // the usual case, the debugger hasn't seen the sources before and
  // will trigger `newSource` notifications for them. However, in a
  // few cases these sources may already exist in the debugger server:
  // other tools have interacted with them, a `debugger` statement was
  // hit before the debugger is initialized, or a page was loading
  // from bfcache. In all these cases, we need to make sure to fire
  // `newSource` notifications even if the server doesn't. Otherwise
  // they won't appear in the debugger.
  return threadClient.getSources().then(({ sources }) => {
    sources.forEach(source => clientEvents.newSource(null, { source }));

    // If the threadClient is already paused, make sure to show a
    // paused state.
    clientEvents.paused(null, threadClient.getLastPausePacket());
  });
}

module.exports = {
  connectClient,
  connectTab,
  clientCommands,
  getThreadClient,
  setThreadClient,
  getTabTarget,
  setTabTarget,
  initPage
};
