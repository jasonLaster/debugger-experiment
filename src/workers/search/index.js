/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// import { workerUtils } from "devtools-utils";
// const { WorkerDispatcher } = workerUtils;

import { handlers } from "./worker";
//
// const dispatcher = new WorkerDispatcher();
// export const start = dispatcher.start.bind(dispatcher);
// export const stop = dispatcher.stop.bind(dispatcher);
//

function task(name) {
  return async (...args) =>
    new Promise(resolve => {
      setTimeout(() => resolve(handlers[name](...args)));
    });
}

export const getMatches = task("getMatches");
export const findSourceMatches = task("findSourceMatches");
