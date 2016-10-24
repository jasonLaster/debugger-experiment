// @flow
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Redux actions for breakpoints
 * @module actions/breakpoints
 */

const constants = require("../constants");
const { PROMISE } = require("../utils/redux/middleware/promise");
const { getBreakpoint, getSource } = require("../selectors");

const {
  getOriginalLocation, getGeneratedLocation, isOriginalId
} = require("../utils/source-map");

import type { ThunkArgs } from "./types";
import type { Location } from "../types";

function _breakpointExists(state, location: Location) {
  const currentBp = getBreakpoint(state, location);
  return currentBp && !currentBp.disabled;
}

function _getOrCreateBreakpoint(state, location, condition) {
  return getBreakpoint(state, location) || { location, condition, text: "" };
}

/**
 * Enabling a breakpoint calls {@link addBreakpoint}
 * which will reuse the existing breakpoint information that is stored.
 *
 * @memberof actions/breakpoints
 * @static
 */
function enableBreakpoint(location: Location) {
  return addBreakpoint(location);
}

/**
 * Add a new or enable an existing breakpoint
 *
 * @memberof actions/breakpoints
 * @static
 * @param {String} $1.condition Conditional breakpoint condition value
 * @param {Function} $1.getTextForLine Get the text to represent the line
 */
function addBreakpoint(location: Location,
                       { condition, getTextForLine } : any = {}) {
  return ({ dispatch, getState, client }: ThunkArgs) => {
    if (_breakpointExists(getState(), location)) {
      return Promise.resolve();
    }

    const bp = _getOrCreateBreakpoint(getState(), location, condition);

    return dispatch({
      type: constants.ADD_BREAKPOINT,
      breakpoint: bp,
      condition: condition,
      [PROMISE]: (async function () {
        if (isOriginalId(bp.location.sourceId)) {
          const source = getSource(getState(), bp.location.sourceId);
          const sourceUrl = source ? source.get("url") : null;

          location = await getGeneratedLocation(bp.location, sourceUrl);
        }

        let { id, actualLocation } = await client.setBreakpoint(
          location,
          bp.condition,
          isOriginalId(bp.location.sourceId)
        );

        actualLocation = await getOriginalLocation(actualLocation);

        // If this breakpoint is being re-enabled, it already has a
        // text snippet.
        let text = bp.text;
        if (!text) {
          text = getTextForLine ? getTextForLine(actualLocation.line) : "";
        }

        return { id, actualLocation, text };
      })()
    });
  };
}

/**
 * Disable a single breakpoint
 *
 * @memberof actions/breakpoints
 * @static
 */
function disableBreakpoint(location: Location) {
  return _removeOrDisableBreakpoint(location, true);
}

/**
 * Remove a single breakpoint
 *
 * @memberof actions/breakpoints
 * @static
 */
function removeBreakpoint(location: Location) {
  return _removeOrDisableBreakpoint(location, false);
}

function _removeOrDisableBreakpoint(location: Location, isDisabled: boolean) {
  return async function({ dispatch, getState, client }: ThunkArgs) {
    let bp = getBreakpoint(getState(), location);
    if (!bp) {
      throw new Error("attempt to remove breakpoint that does not exist");
    }
    if (bp.loading) {
      // TODO(jwl): make this wait until the breakpoint is saved if it
      // is still loading
      throw new Error("attempt to remove unsaved breakpoint");
    }

    // If the breakpoint is already disabled, we don't need to remove
    // it from the server. We just need to dispatch an action
    // simulating a successful server request to remove it, and it
    // will be removed completely from the state.
    if (!bp.disabled) {
      await client.removeBreakpoint(bp.id);
    }

    return dispatch({
      type: constants.REMOVE_BREAKPOINT,
      breakpoint: bp,
      disabled: isDisabled
    });
  };
}

/**
 * Toggle All Breakpoints
 *
 * @memberof actions/breakpoints
 * @static
 */
function toggleAllBreakpoints(shouldDisableBreakpoints: boolean) {
  return ({ dispatch, getState, client }: ThunkArgs) => {
    return dispatch({
      type: constants.TOGGLE_BREAKPOINTS,
      shouldDisableBreakpoints,
      [PROMISE]: client.toggleAllBreakpoints(shouldDisableBreakpoints)
    });
  };
}

/**
 * Update the condition of a breakpoint.
 *  **NOT IMPLEMENTED**
 *
 * @throws {Error} "not implemented"
 * @memberof actions/breakpoints
 * @static
 * @param {Location} location
 *        @see DebuggerController.Breakpoints.addBreakpoint
 * @param {string} condition
 *        The condition to set on the breakpoint
 */
function setBreakpointCondition(location: Location, condition: string) {
  return ({ dispatch, getState, client }: ThunkArgs) => {
    const bp = getBreakpoint(getState(), location);
    if (!bp) {
      throw new Error("Breakpoint does not exist at the specified location");
    }
    if (bp.loading) {
      // TODO(jwl): when this function is called, make sure the action
      // creator waits for the breakpoint to exist
      throw new Error("breakpoint must be saved");
    }

    return dispatch({
      type: constants.SET_BREAKPOINT_CONDITION,
      breakpoint: bp,
      condition: condition,
      [PROMISE]: client.setBreakpointCondition(
        bp.id,
        location,
        condition,
        isOriginalId(bp.location.sourceId)
      )
    });
  };
}

module.exports = {
  enableBreakpoint,
  addBreakpoint,
  disableBreakpoint,
  removeBreakpoint,
  toggleAllBreakpoints,
  setBreakpointCondition
};
