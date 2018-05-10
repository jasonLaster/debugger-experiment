/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

const {
  originalToGeneratedId,
  generatedToOriginalId,
  isGeneratedId,
  isOriginalId
} = require("./utils");

import { handlers } from "./worker";

function task(name) {
  return async (...args) =>
    new Promise(resolve => {
      setTimeout(() => resolve(handlers[name](...args)));
    });
}

const getOriginalURLs = task("getOriginalURLs");
const getGeneratedRanges = task("getGeneratedRanges");
const getGeneratedLocation = task("getGeneratedLocation");
const getAllGeneratedLocations = task("getAllGeneratedLocations");
const getOriginalLocation = task("getOriginalLocation");
const getLocationScopes = task("getLocationScopes");
const getOriginalSourceText = task("getOriginalSourceText");
const applySourceMap = task("applySourceMap");
const clearSourceMaps = task("clearSourceMaps");
const hasMappedSource = task("hasMappedSource");

module.exports = {
  originalToGeneratedId,
  generatedToOriginalId,
  isGeneratedId,
  isOriginalId,
  hasMappedSource,
  getOriginalURLs,
  getGeneratedRanges,
  getGeneratedLocation,
  getAllGeneratedLocations,
  getOriginalLocation,
  getLocationScopes,
  getOriginalSourceText,
  applySourceMap,
  clearSourceMaps
};
