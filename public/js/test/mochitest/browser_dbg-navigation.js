/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

function countSources(dbg) {
  const sources = dbg.selectors.getSources(dbg.getState());
  return sources.size;
}

function* loadScriptsPage(dbg) {
  yield navigate(dbg, "scripts");
  yield addBreakpoint(dbg, "simple1.js", 4);
  invokeInTab("main");
  yield waitForPaused(dbg);
  assertPausedLocation(dbg, "simple1.js", 4);
  is(countSources(dbg), 4, "4 sources are loaded.");
}

/**
 * Test navigating
 * navigating while paused will reset the pause state and sources
 */
add_task(function* () {
  const dbg = yield initDebugger("switching");

  invokeInTab("firstCall");
  yield waitForPaused(dbg);

  yield Task.spawn(loadScriptsPage(dbg));

  yield navigate(dbg, "aboutBlank");
  is(countSources(dbg), 0, "0 sources are loaded.");

  yield navigate(dbg, "scripts");

  is(countSources(dbg), 4, "4 sources are loaded.");
});
