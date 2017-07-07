/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

// Tests basic pretty-printing functionality.

add_task(function*() {
  const dbg = yield initDebugger("doc-minified.html");

  yield selectSource(dbg, "math.min.js", 2);
  clickElement(dbg, "prettyPrintButton");
  yield waitForDispatch(dbg, "SELECT_SOURCE");

  const ppSrc = findSource(dbg, "math.min.js:formatted");
  ok(ppSrc, "Pretty-printed source exists");

  assertHighlightLocation(dbg, "math.min.js:formatted", 18);

  yield addBreakpoint(dbg, ppSrc, 18);

  invokeInTab("arithmetic");
  yield waitForPaused(dbg);
  assertPausedLocation(dbg, ppSrc, 18);
  yield stepOver(dbg);
  assertPausedLocation(dbg, ppSrc, 27);
  yield resume(dbg);

  // The pretty-print button should go away in the pretty-printed
  // source.
  ok(!findElement(dbg, "editorFooter"), "Footer is hidden");

  yield selectSource(dbg, "math.min.js");
  ok(findElement(dbg, "editorFooter"), "Footer is hidden");
});
