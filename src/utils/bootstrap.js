/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

import React from "react";
import { bindActionCreators, combineReducers } from "redux";
import ReactDOM from "react-dom";
const { Provider } = require("react-redux");

import { isFirefoxPanel, isDevelopment, isTesting } from "devtools-environment";
import { startSourceMapWorker, stopSourceMapWorker } from "devtools-source-map";
import * as search from "../workers/search";
import * as prettyPrint from "../workers/pretty-print";
import * as parser from "../workers/parser";

import configureStore from "../actions/utils/create-store";
import reducers from "../reducers";
import * as selectors from "../selectors";
import App from "../components/App";
import { prefs } from "./prefs";

function renderPanel(component, store) {
  const root = document.createElement("div");
  root.className = "launchpad-root theme-body";
  root.style.setProperty("flex", "1");
  const mount = document.querySelector("#mount");
  if (!mount) {
    return;
  }
  mount.appendChild(root);

  ReactDOM.render(
    React.createElement(Provider, { store }, React.createElement(component)),
    root
  );
}

export function bootstrapStore(client: any, { services, toolboxActions }: any) {
  const createStore = configureStore({
    log: isTesting(),
    timing: isDevelopment(),
    makeThunkArgs: (args, state) => {
      return { ...args, client, ...services, ...toolboxActions };
    }
  });

  const store = createStore(combineReducers(reducers));
  store.subscribe(() => updatePrefs(store.getState()));

  const actions = bindActionCreators(
    require("../actions").default,
    store.dispatch
  );

  return { store, actions, selectors };
}

export function bootstrapWorkers() {
  const workerPath = isDevelopment()
    ? "assets/build"
    : "resource://devtools/client/debugger/new/dist";
  const sourceMaps = require("devtools-source-map");
  const prettyPrint = require("../workers/pretty-print");
  const parser = require("../workers/parser");
  const search = require("../workers/search");

  return { sourceMaps, prettyPrint, parser, search };
}

export function teardownWorkers() {}

export function bootstrapApp(store: any) {
  if (isFirefoxPanel()) {
    renderPanel(App, store);
  } else {
    const { renderRoot } = require("devtools-launchpad");
    renderRoot(React, ReactDOM, App, store);
  }
}

function updatePrefs(state: any) {
  const pendingBreakpoints = selectors.getPendingBreakpoints(state);

  if (prefs.pendingBreakpoints !== pendingBreakpoints) {
    prefs.pendingBreakpoints = pendingBreakpoints;
  }
}
