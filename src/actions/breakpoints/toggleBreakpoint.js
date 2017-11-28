/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/*
 * It's possible to toggle a breakpoint on or off (creating/removing) or (enabling/disabling)
 * `toggleBreakpoint` is responsible for creating and removing breakpoints
 * `toggleBreakpointStatus` is responsible for enabling and removing breakpoints.
 *
 * Adding/Removing
 * 1. user clicks in the gutter
 * 2. user selects "Add Breakpoint" or "Remove Breakpoint" from the context menu
 * 3. user presses cmd+b
 *
 * Enabling/Disabling
 * 1. user shift clicks in the gutter
 * 2. user selects "Enable Breakpoint" or "Disable Breakpoint" from the context menu
 * 3. user clicks a breakpoint checkbox
 *
 */

function toggleBreakpointStatus(line: number, column?: number) {
  return ({ dispatch, getState, client, sourceMaps }: ThunkArgs) => {
    const bp = getBreakpointAtLocation(getState(), { line, column });
    if (!bp || bp.loading) {
      return;
    }

    if (!bp.disabled) {
      return dispatch(disableBreakpoint(bp.location));
    }

    return dispatch(enableBreakpoint(bp.location));
  };
}

export function toggleBreakpoint(line: number, column?: number) {
  return ({ dispatch, getState, client, sourceMaps }: ThunkArgs) => {
    const selectedSource = getSelectedSource(getState());
    const bp = getBreakpointAtLocation(state, { line, column });
    const isEmptyLine = isEmptyLineInSource(state, line, selectedSource.toJS());

    if (bp) {
      // NOTE: it's possible the breakpoint has slid to a column
      const bpColumn = column || bp.location.column;
      return dispatch(removeBreakpoint({ ...bp.location, column: bpColumn }));
    }

    return dispatch(addBreakpoint({ ...bp.location, line, column }));
  };
}
