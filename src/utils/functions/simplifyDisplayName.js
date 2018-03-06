/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

// Decodes an anonymous naming scheme that
// spider monkey implements based on "Naming Anonymous JavaScript Functions"
// http://johnjbarton.github.io/nonymous/index.html
const objectProperty = /([\w\d]+)$/;
const arrayProperty = /\[(.*?)\]$/;
const functionProperty = /([\w\d]+)[\/\.<]*?$/;
const annonymousProperty = /([\w\d]+)\(\^\)$/;

export function simplifyDisplayName(displayName: string) {
  // if the display name has a space it has already been mapped
  if (/\s/.exec(displayName)) {
    return displayName;
  }

  const scenarios = [
    objectProperty,
    arrayProperty,
    functionProperty,
    annonymousProperty
  ];

  for (const reg of scenarios) {
    const match = reg.exec(displayName);
    if (match) {
      return match[1];
    }
  }

  return displayName;
}
