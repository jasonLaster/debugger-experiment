/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

const {
  setupTestRunner,
  editorSelect
} = require("devtools/client/debugger/new/integration-tests");

add_task(function*() {
  requestLongerTimeout(5);
  setupTestRunner(this);
  yield editorSelect(this);
});
