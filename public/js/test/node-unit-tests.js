"use strict";

const glob = require("glob").sync;
const path = require("path");

// disable css requires
require.extensions[".css"] = function() {
  return {};
};

// transform the test file from absolute path to relative path
// e.g. public/js/components/tests/Frames.js => ../components/tests/Frames.js
function testPath(testFile) {
  return path.join("..", path.relative("public/js", testFile));
}

const testPaths = process.env.TEST_PATHS || "public/js/**/tests/*.js";

glob(testPaths).map(testPath).map(require);
