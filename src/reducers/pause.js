// @flow
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const constants = require("../constants");
const { prefs } = require("../utils/prefs");

import type { Action } from "../actions/types";

type PauseState = {
  pause: ?any,
  isWaitingOnBreak: boolean,
  frames: ?any[],
  selectedFrameId: ?string,
  loadedObjects: Object,
  shouldPauseOnExceptions: boolean,
  shouldIgnoreCaughtExceptions: boolean,
}

const State = (): PauseState => ({
  pause: undefined,
  isWaitingOnBreak: false,
  frames: undefined,
  selectedFrameId: undefined,
  loadedObjects: {},
  shouldPauseOnExceptions: prefs.pauseOnExceptions,
  shouldIgnoreCaughtExceptions: prefs.ignoreCaughtExceptions,
});

function update(state: PauseState = State(), action: Action): PauseState {
  switch (action.type) {
    case constants.PAUSED: {
      const { selectedFrameId, frames, loadedObjects, pauseInfo } = action;
      pauseInfo.isInterrupted = pauseInfo.why.type === "interrupted";

      // turn this into an object keyed by object id
      let objectMap = {};
      loadedObjects.forEach(obj => {
        objectMap[obj.value.objectId] = obj;
      });

      return Object.assign(state, {
        isWaitingOnBreak: false,
        pause: pauseInfo,
        selectedFrameId,
        frames,
        loadedObjects: objectMap
      });
    }

    case constants.RESUME:
      return Object.assign(state, {
        isWaitingOnBreak: false,
        pause: null,
        frames: null,
        selectedFrameId: null,
        loadedObjects: {}
      });

    case constants.TOGGLE_PRETTY_PRINT:
      if (action.status == "done") {
        const frames = action.value.frames;
        const pause = frames[0];

        return Object.assign(state, { pause, frames });
      }

      break;
    case constants.BREAK_ON_NEXT:
      return Object.assign(state, { isWaitingOnBreak: true });

    case constants.SELECT_FRAME:
      return Object.assign(state, { selectedFrameId: action.frame.id });

    case constants.LOAD_OBJECT_PROPERTIES:
      if (action.status === "start") {
        state.loadedObjects[action.objectId] = {};
        return state;
      }

      if (action.status === "done") {
        if (!action.value) {
          return state;
        }

        const ownProperties = action.value.ownProperties;
        const ownSymbols = action.value.ownSymbols || [];
        const prototype = action.value.prototype;

        const obj = { ownProperties, prototype, ownSymbols };
        state.loadedObjects[action.objectId] = obj;
        return state;
      }
      break;

    case constants.NAVIGATE:
      return State();

    case constants.PAUSE_ON_EXCEPTIONS:
      const { shouldPauseOnExceptions, shouldIgnoreCaughtExceptions } = action;

      prefs.pauseOnExceptions = shouldPauseOnExceptions;
      prefs.ignoreCaughtExceptions = shouldIgnoreCaughtExceptions;

      return Object.assign(state, {
        shouldPauseOnExceptions,
        shouldIgnoreCaughtExceptions
      });
  }

  return state;
}

// Selectors

// Unfortunately, it's really hard to make these functions accept just
// the state that we care about and still type it with Flow. The
// problem is that we want to re-export all selectors from a single
// module for the UI, and all of those selectors should take the
// top-level app state, so we'd have to "wrap" them to automatically
// pick off the piece of state we're interested in. It's impossible
// (right now) to type those wrapped functions.
type OuterState = { pause: PauseState };

function getPause(state: OuterState) {
  return state.pause.pause;
}

function getLoadedObjects(state: OuterState) {
  return state.pause.loadedObjects;
}

function getLoadedObject(state: OuterState, objectId: string) {
  return getLoadedObjects(state)[objectId];
}

function getObjectProperties(state: OuterState, parentId: string) {
  return getLoadedObjects(state)
    .filter(obj => obj.parentId == parentId);
}

function getIsWaitingOnBreak(state: OuterState) {
  return state.pause.isWaitingOnBreak;
}

function getShouldPauseOnExceptions(state: OuterState) {
  return state.pause.shouldPauseOnExceptions;
}

function getShouldIgnoreCaughtExceptions(state: OuterState) {
  return state.pause.shouldIgnoreCaughtExceptions;
}

function getFrames(state: OuterState) {
  return state.pause.frames;
}

function getSelectedFrame(state: OuterState) {
  const selectedFrameId = state.pause.selectedFrameId;
  const frames = state.pause.frames;
  if (!frames) {
    return null;
  }

  return frames.find(
    frame => frame.id == selectedFrameId
  );
}

// NOTE: currently only used for chrome
function getChromeScopes(state: OuterState) {
  const frame = getSelectedFrame(state);
  return frame ? frame.scopeChain : undefined;
}

module.exports = {
  State,
  update,
  getPause,
  getChromeScopes,
  getLoadedObjects,
  getLoadedObject,
  getObjectProperties,
  getIsWaitingOnBreak,
  getShouldPauseOnExceptions,
  getShouldIgnoreCaughtExceptions,
  getFrames,
  getSelectedFrame
};
