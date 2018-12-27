/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

/**
 * Debuggee reducer
 * @module reducers/debuggee
 */

import { sortBy } from "lodash";
import { getDisplayName } from "../utils/workers";

import type { Thread, WorkersList } from "../types";
import type { Action } from "../actions/types";

export type DebuggeeState = {
  workers: WorkersList,
  mainThread: Thread
};

export function initialDebuggeeState(): DebuggeeState {
  return { workers: [], mainThread: { actor: "", url: "" } };
}

export default function debuggee(
  state: DebuggeeState = initialDebuggeeState(),
  action: Action
): DebuggeeState {
  switch (action.type) {
    case "CONNECT":
      return {
        ...state,
        mainThread: {
          actor: action.thread,
          url: action.url
        }
      };
    case "SET_WORKERS":
      return { ...state, workers: action.workers };
    case "NAVIGATE":
      return {
        ...initialDebuggeeState(),
        mainThread: action.mainThread
      };
    default:
      return state;
  }
}

export const getWorkers = (state: OuterState) => state.debuggee.workers;

export const getWorkerCount = (state: OuterState) => getWorkers(state).length;

export function getWorkerByThread(state: OuterState, thread: string) {
  return getWorkers(state).find(worker => worker.actor == thread);
}

export function getMainThread(state: OuterState): Thread {
  return state.debuggee.mainThread;
}

export function getDebuggeeUrl(state: OuterState): string {
  return getMainThread(state).url;
}

export function getThreads(state: OuterState) {
  return [getMainThread(state), ...sortBy(getWorkers(state), getDisplayName)];
}

type OuterState = { debuggee: DebuggeeState };
