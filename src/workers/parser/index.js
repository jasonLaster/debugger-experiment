/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

// import { workerUtils } from "devtools-utils";
// const { WorkerDispatcher } = workerUtils;

import { handlers } from "./worker";

function task(name) {
  return async (...args) =>
    new Promise(resolve => {
      setTimeout(() => resolve(handlers[name](...args)));
    });
}

// const dispatcher = new WorkerDispatcher();
// export const start = dispatcher.start.bind(dispatcher);
// export const stop = dispatcher.stop.bind(dispatcher);

export const getSymbols = task("getSymbols");
export const getScopes = task("getScopes");
export const findOutOfScopeLocations = task("findOutOfScopeLocations");
export const clearSymbols = task("clearSymbols");
export const clearScopes = task("clearScopes");
export const clearASTs = task("clearASTs");
export const getNextStep = task("getNextStep");
export const hasSource = task("hasSource");
export const setSource = task("setSource");
export const clearSources = task("clearSources");
export const hasSyntaxError = task("hasSyntaxError");
export const mapOriginalExpression = task("mapOriginalExpression");
export const getFramework = task("getFramework");
export const getPausePoints = task("getPausePoints");

export type {
  SourceScope,
  BindingData,
  BindingLocation,
  BindingLocationType,
  BindingDeclarationLocation,
  BindingMetaValue,
  BindingType
} from "./getScopes";

export type {
  AstLocation,
  AstPosition,
  PausePoint,
  PausePoints
} from "./types";

export type {
  ClassDeclaration,
  SymbolDeclaration,
  SymbolDeclarations,
  FunctionDeclaration
} from "./getSymbols";
