const { BreakpointResult, Location } = require("../../types");
const defer = require("../../utils/defer");
const remove = require("lodash/remove");

let bpClients;
let threadClient;
let tabTarget;
let debuggerClient;

function setupCommands(dependencies) {
  threadClient = dependencies.threadClient;
  tabTarget = dependencies.tabTarget;
  debuggerClient = dependencies.debuggerClient;
  bpClients = {};
}

function resume() {
  return new Promise(resolve => {
    threadClient.resume(resolve);
  });
}

function stepIn() {
  return new Promise(resolve => {
    threadClient.stepIn(resolve);
  });
}

function stepOver() {
  return new Promise(resolve => {
    threadClient.stepOver(resolve);
  });
}

function stepOut() {
  return new Promise(resolve => {
    threadClient.stepOut(resolve);
  });
}

function breakOnNext() {
  return threadClient.breakOnNext();
}

function sourceContents(sourceId) {
  const sourceClient = threadClient.source({ actor: sourceId });
  return sourceClient.source();
}

function setBreakpoint(location, condition, noSliding) {
  const sourceClient = threadClient.source({ actor: location.sourceId });

  return sourceClient.setBreakpoint({
    line: location.line,
    column: location.column,
    condition,
    noSliding
  }).then((res) => onNewBreakpoint(location, res));
}

function onNewBreakpoint(location, res) {
  const bpClient = res[1];
  let actualLocation = res[0].actualLocation;
  bpClients[bpClient.actor] = bpClient;

  // Firefox only returns `actualLocation` if it actually changed,
  // but we want it always to exist. Format `actualLocation` if it
  // exists, otherwise use `location`.
  actualLocation = actualLocation ? {
    sourceId: actualLocation.source.actor,
    line: actualLocation.line,
    column: actualLocation.column
  } : location;

  return BreakpointResult({
    id: bpClient.actor,
    actualLocation: Location(actualLocation)
  });
}

function removeBreakpoint(breakpointId) {
  let bpClient = bpClients[breakpointId];
  if (!bpClient) {
    bpClient = remove(lastDisabledBreakpoints, bp => bp.id == breakpointId)[0];
  }

  delete bpClients[breakpointId];
  return bpClient.remove();
}

let lastDisabledBreakpoints = [];

async function toggleAllBreakpoints(shouldDisableBreakpoints) {
  if (shouldDisableBreakpoints) {
    return await disableAllBreakpoints();
  }

  return await enableAllBreakoints();
}

/**
 * Disable the breakpoints on the server, but keep the breakpoints
 * in the UI so that the user can easily re-enable them again.
 *
 * Save the disabled breakpoints as they're represented in the
 * store in lastDisabledBreakpoints.
 *
 */
async function disableAllBreakpoints() {
  for (let id of Object.keys(bpClients)) {
    const bpClient = bpClients[id];
    await removeBreakpoint(bpClient.actor);
    lastDisabledBreakpoints.push(BreakpointResult({
      id: bpClient.actor,
      actualLocation: Location({
        sourceId: bpClient.location.actor,
        line: bpClient.location.line,
        column: bpClient.location.column
      })
    }));
  }

  return lastDisabledBreakpoints;
}


/**
 * Re-Enables the breakpoint in the UI, by iterating over the
 * disabled breakpoints and setting them again.
 *
 * We then update the store with the new breakpoint IDs.
 *
 */
async function enableAllBreakoints() {
  let changed = [];
  for (const bp of lastDisabledBreakpoints) {
    const bpClient = await setBreakpoint(bp.actualLocation, bp.condition);
    changed.push(BreakpointResult({
      id: bpClient.id,
      actualLocation: bp.actualLocation
    }))
  }

  lastDisabledBreakpoints = [];
  return changed;
}

function setBreakpointCondition(breakpointId, location, condition, noSliding) {
  let bpClient = bpClients[breakpointId];
  delete bpClients[breakpointId];

  return bpClient.setCondition(threadClient, condition, noSliding)
    .then(_bpClient => onNewBreakpoint(location, [{}, _bpClient]));
}

function evaluate(script) {
  const deferred = defer();
  tabTarget.activeConsole.evaluateJS(script, (result) => {
    deferred.resolve(result);
  });

  return deferred.promise;
}

function debuggeeCommand(script) {
  tabTarget.activeConsole.evaluateJS(script, () => {});

  const consoleActor = tabTarget.form.consoleActor;
  const request = debuggerClient._activeRequests.get(consoleActor);
  request.emit("json-reply", {});
  debuggerClient._activeRequests.delete(consoleActor);

  return Promise.resolve();
}

function navigate(url) {
  return tabTarget.activeTab.navigateTo(url);
}

function reload() {
  return tabTarget.activeTab.reload();
}

function getProperties(grip) {
  const objClient = threadClient.pauseGrip(grip);
  return objClient.getPrototypeAndProperties();
}

function pauseOnExceptions(
  shouldPauseOnExceptions, shouldIgnoreCaughtExceptions) {
  return threadClient.pauseOnExceptions(
    shouldPauseOnExceptions,
    shouldIgnoreCaughtExceptions
  );
}

function prettyPrint(sourceId, indentSize) {
  const sourceClient = threadClient.source({ actor: sourceId });
  return sourceClient.prettyPrint(indentSize);
}

function disablePrettyPrint(sourceId) {
  const sourceClient = threadClient.source({ actor: sourceId });
  return sourceClient.disablePrettyPrint();
}

const clientCommands = {
  resume,
  stepIn,
  stepOut,
  stepOver,
  breakOnNext,
  sourceContents,
  setBreakpoint,
  removeBreakpoint,
  toggleAllBreakpoints,
  setBreakpointCondition,
  evaluate,
  debuggeeCommand,
  navigate,
  reload,
  getProperties,
  pauseOnExceptions,
  prettyPrint,
  disablePrettyPrint
};

module.exports = {
  setupCommands,
  clientCommands
};
