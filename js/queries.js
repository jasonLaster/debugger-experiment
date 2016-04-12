"use strict";
const { Map, Seq } = require("immutable");

/* Selectors */
function getSources(state) {
  return state.sources.get("sources");
}

function getSourcesText(state) {
  return state.sources.get("sourcesText");
}

function getSelectedSource(state) {
  return state.sources.get("selectedSource");
}

function getSelectedSourceOpts(state) {
  return state.sources.get("selectedSourceOpts");
}

function getBreakpoints(state) {
  return state.breakpoints.get("breakpoints");
}

function getTabs(state) {
  return state.tabs.get("tabs");
}

function getSelectedTab(state) {
  return state.tabs.get("selectedTab");
}

/* Queries */
function getSource(state, actor) {
  return getSources(state).get(actor) || Map();
}

function getSourceCount(state) {
  return getSources(state).size;
}

function getSourceByURL(state, url) {
  return getSources(state).find(source => source.url == url) || Map();
}

function getSourceByActor(state, actor) {
  return getSources(state).find(source => source.actor == actor) || Map();
}

/* @deprecate getSourceText */
function getSourceText(state, actor) {
  return getSourcesText(state).get(actor) || Map();
}

function getSourceTextByActor(state, actor) {
  return getSourcesText(state).get(actor) || Map();
}

function getBreakpointsSeq(state) {
  return getBreakpoints(state).valueSeq() || Seq();
}

function getBreakpoint(state, location) {
  return getBreakpoints(state).get(makeLocationId(location)) || Map();
}

function makeLocationId(location) {
  return location.actor + ":" + location.line.toString();
}

module.exports = {
  getSource,
  getSources,
  getSourceCount,
  getSourceByURL,
  getSourceByActor,
  getSelectedSource,
  getSelectedSourceOpts,
  getSourceText,
  getSourceTextByActor,
  getBreakpoint,
  getBreakpoints,
  getBreakpointsSeq,
  getTabs,
  getSelectedTab,
  makeLocationId
};
