const { client: { createSource }} = require("devtools-client-adapters");

function onConnect(actions, { connTarget, client }) {
  if (connTarget.type == "chrome") {
    return;
  }

  onFirefoxConnect(actions, client);
}

function onFirefoxConnect(actions, firefox) {
  const tabTarget = firefox.getTabTarget();
  const threadClient = firefox.getThreadClient();

  tabTarget.on("will-navigate", actions.willNavigate);
  tabTarget.on("navigate", actions.navigated);

  // In Firefox, we need to initially request all of the sources. This
  // usually fires off individual `newSource` notifications as the
  // debugger finds them, but there may be existing sources already in
  // the debugger (if it's paused already, or if loading the page from
  // bfcache) so explicity fire `newSource` events for all returned
  // sources.
  return threadClient.getSources().then(({ sources }) => {
    actions.newSources(sources.map(createSource));

    // If the threadClient is already paused, make sure to show a
    // paused state.
    const pausedPacket = threadClient.getLastPausePacket();
    if (pausedPacket) {
      clientEvents.paused(null, pausedPacket);
    }
  });
}

module.exports = {
  onConnect,
  onFirefoxConnect
};
