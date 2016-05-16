#### WebSocketConnection

The WebSocketConnection class is responsible for creating a connection
with the browser. It is also responsible for maintaining a set of connected
agents.

These agents are used to issue commands to the browser
and dispatch events from the browser.

#### generateCommands

generateCommands is a helper function for creating the code that will be evaluated to
dynamically build the agents.

Here's an example snippet:

```js
InspectorBackend.registerEvent("Inspector.inspect", ["object", "hints"]);
InspectorBackend.registerEvent("Inspector.detached", ["reason"]);
InspectorBackend.registerCommand("Page.enable", [], [], false);
InspectorBackend.registerCommand("Debugger.getBacktrace", [], ["callFrames", "asyncStackTrace"], false);
```

#### Steps to upgrade `inspectorBackend.js`:

+ add line `/* eslint-disable */`
+ add line `var WebInspector = {};`
+ copy front_end\/common\/Object.js
+ copy front_end\/sdk\/InspectorBackend.js
+ copy front_end\/main\/Connections.js
+ delete `WebInspector.InspectorBackendHostedMode.loadFromJSONIfNeeded("../protocol.json");`
+ add the exports statement

```js
module.exports = {
  InspectorBackendClass,
  WebSocketConnection: WebInspector.WebSocketConnection,
  generateCommands: WebInspector.InspectorBackendHostedMode.generateCommands
};
```

#### Steps to upgrade the protocol

+ copy the new `protocol.json`
+ run `node public/js/clients/chrome/build-bootstrap`
+ commit the new protocol as well as `bootstrap.js` file
