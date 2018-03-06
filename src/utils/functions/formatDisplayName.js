/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

import { simplifyDisplayName } from "./simplifyDisplayName";

const displayNameMap = {
  Babel: {
    tryCatch: "Async"
  },
  Backbone: {
    "extend/child": "Create Class",
    ".create": "Create Model"
  },
  jQuery: {
    "jQuery.event.dispatch": "Dispatch Event"
  },
  React: {
    // eslint-disable-next-line max-len
    "ReactCompositeComponent._renderValidatedComponentWithoutOwnerOrContext/renderedElement<":
      "Render",
    _renderValidatedComponentWithoutOwnerOrContext: "Render"
  },
  VueJS: {
    "renderMixin/Vue.prototype._render": "Render"
  },
  Webpack: {
    // eslint-disable-next-line camelcase
    __webpack_require__: "Bootstrap"
  }
};

function mapDisplayNames(frame, library) {
  const { displayName } = frame;
  return (
    (displayNameMap[library] && displayNameMap[library][displayName]) ||
    displayName
  );
}

type formatDisplayNameParams = { shouldMapDisplayName: boolean };
export function formatDisplayName(
  frame: LocalFrame,
  { shouldMapDisplayName = true }: formatDisplayNameParams = {}
) {
  let { displayName, library } = frame;
  if (library && shouldMapDisplayName) {
    displayName = mapDisplayNames(frame, library);
  }

  displayName = simplifyDisplayName(displayName);
  return endTruncateStr(displayName, 25);
}
