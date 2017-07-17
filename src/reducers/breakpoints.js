// @flow
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Breakpoints reducer
 * @module reducers/breakpoints
 */

import * as I from "immutable";
import { omit } from "lodash";
import makeRecord from "../utils/makeRecord";
import { isGeneratedId } from "devtools-source-map";
import { prefs } from "../utils/prefs";
import {
  createPendingBreakpoint,
  locationMoved,
  makeLocationId,
  allBreakpointsDisabled
} from "../utils/breakpoint";

import type { Breakpoint, PendingBreakpoint, Location } from "../types";
import type { Action } from "../actions/types";
import type { Record } from "../utils/makeRecord";

export type BreakpointMap = I.Map<string, Breakpoint>;

export type BreakpointsState = {
  breakpoints: BreakpointMap,
  breakpointsDisabled: false
};

export function initialState(): Record<BreakpointsState> {
  return makeRecord(
    ({
      breakpoints: I.Map(),
      breakpointsDisabled: false
    }: BreakpointsState)
  )();
}

function update(
  state: Record<BreakpointsState> = initialState(),
  action: Action
) {
  switch (action.type) {
    case "ADD_BREAKPOINT": {
      return addBreakpoint(state, action);
    }

    case "SYNC_BREAKPOINT": {
      return syncBreakpoint(state, action);
    }

    case "ENABLE_BREAKPOINT": {
      return enableBreakpoint(state, action);
    }

    case "REMOVE_BREAKPOINT": {
      return removeBreakpoint(state, action);
    }

    case "DISABLE_BREAKPOINT": {
      return disableBreakpoint(state, action);
    }

    case "TOGGLE_BREAKPOINTS": {
      if (action.status === "start") {
        return state.set(
          "breakpointsDisabled",
          action.shouldDisableBreakpoints
        );
      }
      break;
    }

    case "SET_BREAKPOINT_CONDITION": {
      return setCondition(state, action);
    }
  }

  return state;
}

function addBreakpoint(state, action) {
  if (action.status === "start") {
    const { breakpoint } = action;
    const locationId = makeLocationId(breakpoint.location);
    return state.setIn(["breakpoints", locationId], breakpoint);
  }
  // when the action completes, we can commit the breakpoint
  if (action.status === "done") {
    const { value: { breakpoint, previousLocation } } = action;
    const locationId = makeLocationId(breakpoint.location);

    if (previousLocation) {
      return state
        .deleteIn(["breakpoints", makeLocationId(previousLocation)])
        .setIn(["breakpoints", locationId], breakpoint);
    }

    return state.setIn(["breakpoints", locationId], breakpoint);
  }

  const locationId = makeLocationId(action.breakpoint.location);
  return state.deleteIn(["breakpoints", locationId]);
}

function syncBreakpoint(state, action) {
  if (action.status === "start") {
    // add a breakpoint, so we always have something to work with
    return optimisticlyAddBreakpoint(state, action.breakpoint);
  }
  if (action.status === "done") {
    // when the action completes, we can commit the breakpoint
    const { breakpoint, value: { actualLocation, generatedLocation } } = action;
    const sameLocation = !locationMoved(breakpoint.location, actualLocation);

    // if the breakpoint is the same as the optimistic breakpoint, we can commit
    // to the optimistic value.
    if (sameLocation) {
      return commitBreakpoint(state, breakpoint, action.value);
    }

    // if the breakpoint is not the same, we will use the actual location sent
    // by the server, and correct the breakpoint with that new information.
    // Correcting a breakpoint deletes the optimistic breakpoint.
    // Correcting will commit the corrected value
    const overrides = { location: actualLocation, generatedLocation };
    const updatedState = correctBreakpoint(state, breakpoint, overrides);
    const id = makeLocationId(actualLocation);
    const correctedBreakpoint = updatedState.breakpoints.get(id);
  }

  if (action.status === "error") {
    // Remove the optimistic update
    return deleteBreakpoint(state, action.breakpoint.location);
  }
}

function enableBreakpoint(state, action) {
  if (action.status != "done") {
    return state;
  }

  const id = makeLocationId(action.breakpoint.location);
  const bp = state.breakpoints.get(id);
  const updatedBreakpoint = {
    ...bp,
    id: action.value.id,
    loading: false,
    disabled: false
  };
  return state.setIn(["breakpoints", id], updatedBreakpoint);
}

function disableBreakpoint(state, action) {
  if (action.status != "done") {
    return state;
  }
  const id = makeLocationId(action.breakpoint.location);
  const bp = state.breakpoints.get(id);
  const breakpoint = {
    ...bp,
    loading: false,
    disabled: true
  };

  return state.setIn(["breakpoints", id], breakpoint);
}

function deleteBreakpoint(state, location) {
  const id = makeLocationId(location);

  return state.deleteIn(["breakpoints", id]);
}

function removeBreakpoint(state, action) {
  if (action.status != "done") {
    return state;
  }

  const updatedState = deleteBreakpoint(state, action.breakpoint.location);

  return updatedState.set(
    "breakpointsDisabled",
    allBreakpointsDisabled(updatedState)
  );
}

function setCondition(state, action) {
  const id = makeLocationId(action.breakpoint.location);

  if (action.status === "start") {
    const bp = state.breakpoints.get(id);
    return state.setIn(["breakpoints", id], {
      ...bp,
      loading: true,
      condition: action.condition
    });
  }

  if (action.status === "done") {
    const bp = state.breakpoints.get(id);
    const updatedBreakpoint = { ...bp, loading: false };
    return state.setIn(["breakpoints", id], updatedBreakpoint);
  }

  if (action.status === "error") {
    return state.deleteIn(["breakpoints", id]);
  }
}

// Syncing Methods
function optimisticlyAddBreakpoint(state, breakpoint) {
  const id = makeLocationId(breakpoint.location);
  const updateOpts = {
    loading: true
  };

  return state.setIn(["breakpoints", id], { ...breakpoint, ...updateOpts });
}

function commitBreakpoint(state, breakpoint, overrides = {}) {
  // A commited breakpoint is no longer loading, and acts like a normal
  // breakpoint
  const location = overrides.location || breakpoint.location;
  const id = makeLocationId(location);
  const updatedOpts = { ...overrides, loading: false };
  const updatedBreakpoint = { ...breakpoint, ...updatedOpts };

  return state.setIn(["breakpoints", id], updatedBreakpoint);
}

function correctBreakpoint(state, breakpoint, overrides) {
  const intermState = deleteBreakpoint(state, breakpoint.location);
  const newLocationId = makeLocationId(overrides.location);
  const newProperties = { id: newLocationId, ...overrides };

  return commitBreakpoint(intermState, breakpoint, newProperties);
}

// Selectors
// TODO: these functions should be moved out of the reducer

type OuterState = { breakpoints: Record<BreakpointsState> };

export function getBreakpoint(state: OuterState, location: Location) {
  const breakpoints = getBreakpoints(state);
  return breakpoints.get(makeLocationId(location));
}

export function getBreakpoints(state: OuterState) {
  return state.breakpoints.get("breakpoints");
}

export function getBreakpointsDisabled(state: OuterState): boolean {
  return state.breakpoints.get("breakpointsDisabled");
}

export function getBreakpointsLoading(state: OuterState) {
  const breakpoints = getBreakpoints(state);
  const isLoading = !!breakpoints.valueSeq().filter(bp => bp.loading).first();

  return breakpoints.size > 0 && isLoading;
}

export function getBreakpointsForSource(state: OuterState, sourceId: string) {
  if (!sourceId) {
    return I.Map();
  }

  const isGeneratedSource = isGeneratedId(sourceId);
  const breakpoints = getBreakpoints(state);

  return breakpoints.filter(bp => {
    const location = isGeneratedSource
      ? bp.generatedLocation || bp.location
      : bp.location;
    return location.sourceId === sourceId;
  });
}

function getPendingBreakpoints(state): PendingBreakpointMap {
  const breakpoints = getBreakpoints(state);

  // note it should return the same map and keys as the breakpoint map
  return breakpoints.map(createPendingBreakpoint);
}

export default update;
