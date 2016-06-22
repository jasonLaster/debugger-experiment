"use strict";

const actions = require("../actions");
const selectors = require("../selectors");
const {createStore} = require("../util/test-head");
const { bindActionCreators } = require("redux");
const {objectMap} = require("devtools-sham/shared/DevToolsUtils");

function mockClient(fixture) {
  return {
    source: function(sourceId) {
      return new Promise((resolve, reject) => {
        resolve(fixture.sources.sources[sourceId]);
      });
    },
    sourceContents: function(sourceId) {
      return new Promise((resolve, reject) => {
        resolve(fixture.sources.sourcesText[sourceId]);
      });
    }
  }
};

function bindSelectors(selectors, store) {
  return objectMap(selectors, (selector) => {
    return function() {
      return selector(store.getState(), ...arguments);
    };
  });
}

function mockClientStore(initialState = {}, fixtureData) {
  const store = createStore(mockClient(fixtureData), initialState)
  const boundActions = bindActionCreators(actions, store.dispatch);
  const boundSelectors = bindSelectors(selectors, store);
  return Object.assign({}, boundActions, boundSelectors);
}

module.exports = {
  mockClientStore
}
