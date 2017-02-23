const {
  initDebugger,
  assertPausedLocation,
  findSource,
  addBreakpoint
} = require("../utils")

// tests the watch expressions component

module.exports = async function(ctx) {
  const { ok, is, info, requestLongerTimeout } = ctx;
  const dbg = await initDebugger("doc-scripts.html");
  await waitForPaused(dbg);
});
