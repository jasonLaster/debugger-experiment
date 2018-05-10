/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

import { isJavaScript } from "../../utils/source";
import assert from "../../utils/assert";

import type { SourceRecord } from "../../types";

import { handlers } from "./worker";

function task(name) {
  return async (...args) =>
    new Promise(resolve => {
      setTimeout(() => resolve(handlers[name](...args)));
    });
}

const _prettyPrint = task("prettyPrint");

type PrettyPrintOpts = {
  source: SourceRecord,
  url: string
};

export async function prettyPrint({ source, url }: PrettyPrintOpts) {
  const indent = 2;

  assert(isJavaScript(source), "Can't prettify non-javascript files.");

  return await _prettyPrint({
    url,
    indent,
    sourceText: source.text
  });
}
