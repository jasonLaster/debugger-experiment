/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

// Tests the breakpoints are hit in various situations.


add_task(function* () {
  const url = EXAMPLE_URL + "doc-script-switching.html";
  const toolbox = yield openNewTabAndToolbox(url, "webconsole");

  let jsterm = toolbox.getPanel("webconsole").hud.jsterm;
  jsterm.execute("debugger");

  yield waitForTime(100000);
});
