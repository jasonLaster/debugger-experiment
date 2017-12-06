/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

/* global window */

import type { ThunkArgs, ActionType } from "../../types";

export const scheduler = {
  pendingActions: {},
  id: 1,
  namedBeforeEventListners: {},
  namedAfterEventListners: {},
  beforeEventListners: {},
  afterEventListners: {},
  before(name, callback) {
    if (name) {
      if (!this.namedBeforeEventListners[name]) {
        this.namedBeforeEventListners[name] = [];
      }
      this.namedBeforeEventListners[name].push(callback);
    } else {
      this.beforeEventListners.push(callback);
    }
  },

  after(name, callback) {
    if (name) {
      if (!this.namedAfterEventListners[name]) {
        this.namedAfterEventListners[name] = [];
      }
      this.namedAfterEventListners[name].push(callback);
    } else {
      this.afterEventListners.push(callback);
    }
  },

  getPendingActions(name) {
    if (name) {
      return !this.pendingActions[name]
        ? []
        : Object.values(this.pendingActions[name]);
    }

    return [
      ...Object.values(this.pendingActions).map(action => Object.values(action))
    ];
  }
},

getPendingAction(name) {
  if (!name) {
    new Error("must have a name")
  }
    return !this.pendingActions[name]
      ? null
      : Object.values(this.pendingActions[name])[0];
  }

  return [
    ...Object.values(this.pendingActions).map(action => Object.values(action))
  ];
}
};
/**
 * A middleware that allows thunks (functions) to be dispatched. If
 * it's a thunk, it is called with an argument that contains
 * `dispatch`, `getState`, and any additional args passed in via the
 * middleware constructure. This allows the action to create multiple
 * actions (most likely asynchronously).
 */
export function thunk(makeArgs: any) {
  return ({ dispatch, getState }: ThunkArgs) => {
    const args = { dispatch, getState };

    return (next: Function) => (action: ActionType) => {
      if (typeof action === "function") {
        const computedArgs = makeArgs ? makeArgs(args, getState()) : args;

        const name = action.name;
        dump(`name: ${name}\n`);

        const promise = action(computedArgs);
        if (name && promise.then) {
          const id = scheduler.id++;
          if (!scheduler.pendingActions[name]) {
            scheduler.pendingActions[name] = {};
          }

          scheduler.pendingActions[name][id] = promise;

          promise.then(response => {
            delete scheduler.pendingActions[name][id];
          });
        }

        return;
      }

      return next(action);
    };
  };
}
