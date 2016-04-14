"use strict";

const { combineReducers } = require("redux");
const reducers = require("../reducers");
const actions = require("../actions");
const constants = require("../constants");
const configureStore = require("../create-store");
const queries = require("../queries");
const promise = require("devtools/sham/promise");
const { Task } = require("devtools/sham/task");

// const mockThreadClient = {
// };
let mockThreadClient;

const _createStore = configureStore({
  log: false,
  makeThunkArgs: args => {
    return Object.assign({}, args, { threadClient: mockThreadClient });
  }
});

function createStore(threadClient) {
  mockThreadClient = threadClient;
  return _createStore(combineReducers(reducers));
}

function commonLog(msg) {
  dump(msg + "\n");
}

function waitUntilState(store, predicate) {
  let deferred = promise.defer();
  let unsubscribe = store.subscribe(check);

  commonLog(`Waiting for state predicate "${predicate}"`);
  function check() {
    if (predicate(store.getState())) {
      commonLog(`Found state predicate "${predicate}"`);
      unsubscribe();
      deferred.resolve();
    }
  }

  // Fire the check immediately in case the action has already occurred
  check();

  return deferred.promise;
}

module.exports = { createStore, actions,
  queries, constants, waitUntilState, Task, commonLog };
