/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

import { getSymbols } from "../../workers/parser";
import { findClosestFunction } from "../../utils/ast";

import type { Scope, AstPosition } from "../../workers/parser/types";
import type { SymbolDeclarations } from "../../workers/parser/getSymbols";
import type { Location, Source, ASTLocation } from "../../types";

export function getASTLocation(
  source: Source,
  symbols: SymbolDeclarations,
  location: Location
): ASTLocation {
  if (source.isWasm) {
    return { name: undefined, offset: location };
  }

  const functions = [...symbols.functions];

  const scope = findClosestFunction(functions, location);
  if (scope) {
    // we only record the line, but at some point we may
    // also do column offsets
    const line = location.line - scope.location.start.line;
    return {
      name: scope.name,
      offset: { line, column: undefined }
    };
  }
  return { name: undefined, offset: location };
}

export async function findScopeByName(source: Source, name: ?string) {
  const symbols = await getSymbols(source.id);
  const functions = symbols.functions;

  return functions.find(node => node.name === name);
}
