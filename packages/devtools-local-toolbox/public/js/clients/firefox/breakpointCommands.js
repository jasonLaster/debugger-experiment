
/**
  1. enable  bp                                  - enabling the breakpoint checkbox             - enable bp
  2. enable bp when globally disabled            - X (checkboxes are masked)                    - X
  3. enable bp via global toggle                 - enable breakpoints button                    - enable bp on the server, but does not change the bp appearance as it was already checked
  4. disable bp                                  - disabling the breakpoint checkbox            - disable bp
  5. disable bp when globally disabled           - X (checkboxes are masked)                    - X
  6. disable bp via global toggle                - disable breakpoints button                   - disable bp on the server, but does not change the bp appearance
  7. add bp                                      - click a new line gutter                      - add bp
  8. add bp when globally disabled               - click a new line gutter                      - enables the globally disabled bps, adds the bp
  9. remove active bp                            - click a breakpoint in the line gutter        - remove bp
  10. remove disabled bp                         - click a breakpoint in the line gutter        - remove bp
  11. remove active bp when globally disabled    - click a breakpoint in the line gutter        - remove bp
  12. remove disabled bp when globally disabled  - click a breakpoint in the line gutter        - remove bp
  13. add a condition                            - cmd click a breakpoint in the line gutter    - add bp condition
  14. add a condition to a disabled bp           - cmd click a breakpoint in the line gutter    - add bp condition
  15. add a condition to a globally disabled bp  - cmd click a breakpoint in the line gutter    - add bp condition

  1. enable bp
       - create a new breakpoint
       - add breakpoint to list of breakpoints
       - add breakpoint to the store

  2. enable bp when globally disabled
       - not allowed

  3. enable bp via global toggle
       - find breakpoint in list of disabled breakpoints
       - create a new breakpoint on the server
       - update the breakpoint in the store with the new ID

  4. disable bp
       - find breakpoint in the list of breakpoints
       - remove the breakpoint on the server
       - remove breakpoint from the list of breakpoints
       - disable the breakpoint in the store

  5. disable bp via global toggle
       - find breakpoint in the list of breakpoints
       - remove the breakpoint on the server
       - add breakpoint to the list of disabled breakpoint


  6. disable bp when globally disabled
      - Not allowed

  7. add bp
      - create a breakpoint on the server
      - add it to the list of breakpoints
      - add it to the store

  8. add bp when globally disabled
      - enable all globally disabled breakpoints
      - add the breakpoint


  9. remove active bp
      - find breakpoint in the breakpoint list
      - remove it from the server
      - remove it from the store

  10. remove disabled bp
      - find breakpoint in the breakpoint list
      - remove it from the server
      - remove it from the store

  11. remove active bp when globally disabled
      - find breakpoint in the disabled breakpoint list
      - remove it from the server
      - remove it from the store

  12. remove disabled bp when globally disabled
      - find breakpoint in the disabled breakpoint list
      - remove it from the server
      - remove it from the store

  13. add a condition
      - find breakpoint in the breakpoint list
      - remove it from the server
      - create a new one on the server
      - update the condition and id in the store

  14. add a condition to a disabled breakpoint
      - find breakpoint in the disabled breakpoint list
      - remove it from the server
      - create a new one on the server
      - update the condition and id in the store

  15. add a condition to a globally disabled breakpoint
      - find breakpoint in the disabled breakpoint list
      - remove it from the server
      - create a new one on the server
      - update the condition and id in the store
*/

function enableBreakpoint() {

}

function disableBreakpoint() {

}

function addBreakpoint() {

}

function removeBreakpoint() {

}

function setBreakpointCondition() {

}

function enableBreakpoints() {

}

function disableBreakpoints() {

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

function onNewBreakpoint(oldLocation, res) {
  const bpClient = res[1];
  let newLocation = res[0].actualLocation;
  bpClients[bpClient.actor] = bpClient;

  // Firefox only returns `actualLocation` if it actually changed,
  // but we want it always to exist. Format `actualLocation` if it
  // exists, otherwise use `location`.
  let actualLocation = oldLocation;
  if (newLocation) {
    actualLocation = {
      sourceId: newLocation.source.actor,
      line: newLocation.line,
      column: newLocation.column
    }
  }

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
