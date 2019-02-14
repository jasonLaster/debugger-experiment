// @flow

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
import { createSelector } from "reselect";

import {
  getSources,
  getSourceActors,
  getWorkers,
  getDebuggeeUrl,
  getMainThread
} from "../selectors";

export function getRelativeSourcesForThread(state, threadUrl) {
  const relativeSources = getRelativeSources(state);
  return relativeSources[threadUrl];
}

// NOTE: we should rename relative sources to something like workerSources
export const getRelativeSources: Selector<{
  [string]: Source
}> = createSelector(
  getSources,
  getSourceActors,
  getWorkers,
  getDebuggeeUrl,
  getMainThread,
  (sources, sourceActors, workers, debuggeeUrl, mainThread) => {
    const threadUrls = [debuggeeUrl, ...workers.map(w => w.url)];

    const threadsToUrls = {};
    threadsToUrls[mainThread] = debuggeeUrl;
    for (const worker of workers) {
      threadsToUrls[worker.actor] = worker.url;
    }

    const relativeSources = {};
    for (const url of threadUrls) {
      relativeSources[url] = {};
    }

    for (const sourceActor of sourceActors) {
      const url = threadsToUrls[sourceActor.actor];
      relativeSources[url][sourceActor.id] = sources[sourceActor.id];
    }

    return relativeSources;
  }
);
