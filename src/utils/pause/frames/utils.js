/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

export function formatCopyName(frame: LocalFrame) {
  const displayName = formatDisplayName(frame);
  const fileName = getFilename(frame.source);
  const frameLocation = frame.location.line;

  return `${displayName} (${fileName}#${frameLocation})`;
}
