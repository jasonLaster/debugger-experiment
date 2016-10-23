// @flow

import type { Source, Breakpoint, Location, SourceText } from "../types";

/**
 * Flow types
 * @module actions/types
 */

/**
  * Argument parameters via Thunk middleware for {@link https://github.com/gaearon/redux-thunk|Redux Thunk}
  *
  * @memberof actions/breakpoints
  * @static
  * @typedef {Object} ThunkArgs
  */
export type ThunkArgs = {
  dispatch: (a: Action) => Promise<ActionResult>,
  getState: () => any,
  client: any
};

type ThunkMiddleWare = (a: ThunkArgs) => any;

/**
 * Tri-state status for async operations
 *
 * Available options are:
 * `"start"` or `"done"` or `"error"`
 *
 * @memberof actions/types
 * @static
 * @enum
 */
export type AsyncStatus = "start" | "done" | "error";

type BreakpointResult = {
  actualLocation: Location,
  id: string,
  text: string
}


type TogglePrettyPrintResult = {
  isPrettyPrinted: boolean,
  sourceText: SourceText
}

export type BreakpointAction =
  { type: "ADD_BREAKPOINT",
    breakpoint: Breakpoint,
    condition: string,
    status: AsyncStatus,
    error: string,
    value: BreakpointResult}
  | { type: "REMOVE_BREAKPOINT",
      breakpoint: Breakpoint,
      status: AsyncStatus,
      error: string,
      disabled: boolean }
  | { type: "SET_BREAKPOINT_CONDITION",
      breakpoint: Breakpoint,
      condition: string,
      status: AsyncStatus,
      value: BreakpointResult,
      error: string }
  | { type: "TOGGLE_BREAKPOINTS",
      shouldDisableBreakpoints: boolean,
      status: AsyncStatus,
      error: string,
      value: any };

export type SourceAction =
  { type: "ADD_SOURCE", source: Source }
  | { type: "SELECT_SOURCE", source: Source,
      line?: number,
      tabIndex?: number }
  | { type: "SELECT_SOURCE_URL", url: string, line?: number }
  | { type: "LOAD_SOURCE_TEXT",
      source: Source,
      status: AsyncStatus,
      error: string,
      value: SourceText }
  | { type: "TOGGLE_PRETTY_PRINT",
      source: Source,
      originalSource: Source,
      status: AsyncStatus,
      error: string,
      value: TogglePrettyPrintResult}
  | { type: "CLOSE_TAB", id: string };


export type ActionResult = BreakpointResult | TogglePrettyPrintResult | SourceText;

/**
 * Actions: Source, Breakpoint, and Navigation
 *
 * @memberof actions/types
 * @static
 */
export type Action = SourceAction | BreakpointAction | { type: "NAVIGATE" } | ThunkMiddleWare;
