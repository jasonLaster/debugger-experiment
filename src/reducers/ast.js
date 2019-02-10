/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

/**
 * Ast reducer
 * @module reducers/ast
 */

import makeRecord from "../utils/makeRecord";
import { findEmptyLines } from "../utils/ast";

import type { SymbolDeclarations } from "../workers/parser";

import type { Map } from "immutable";
import type { SourceLocation, Source, Position, ASTLocation } from "../types";
import type { Action, DonePromiseAction } from "../actions/types";
import type { Record } from "../utils/makeRecord";

type EmptyLinesType = number[];

export type Symbols = SymbolDeclarations | {| loading: true |};
export type SymbolsMap = Map<string, Symbols>;
export type EmptyLinesMap = Map<string, EmptyLinesType>;

export type SourceMetaDataType = {
  framework: ?string
};

export type SourceMetaDataMap = Map<string, SourceMetaDataType>;

export type PausePoint = {
  location: Position,
  generatedLocation: SourceLocation,
  types: { break: boolean, step: boolean }
};

export type PausePointsMap = {
  [line: string]: { [column: string]: PausePoint }
};
export type PausePoints = PausePoint[];
export type PausePointsState = Map<string, PausePoint[]>;

export type Preview =
  | {| updating: true |}
  | null
  | {|
      updating: false,
      expression: string,
      location: ASTLocation,
      cursorPos: any,
      tokenPos: ASTLocation,
      result: Object
    |};

export type ASTState = {
  +symbols: SymbolsMap,
  +emptyLines: EmptyLinesMap,
  +outOfScopeLocations: ?Array<ASTLocation>,
  +inScopeLines: ?Array<number>,
  +preview: Preview,
  +pausePoints: PausePointsState,
  +sourceMetaData: SourceMetaDataMap
};

export function initialASTState(): ASTState {
  return {
    symbols: {},
    emptyLines: {},
    outOfScopeLocations: null,
    inScopeLines: null,
    preview: null,
    pausePoints: {},
    sourceMetaData: {}
  };
}

function update(state: ASTState = initialASTState(), action: Action): ASTState {
  switch (action.type) {
    case "SET_SYMBOLS": {
      const { sourceId } = action;
      if (action.status === "start") {
        return {
          ...state,
          symbols: { ...state.symbols, [sourceId]: { loading: true } }
        };
      }

      const value = ((action: any): DonePromiseAction).value;
      return {
        ...state,
        symbols: { ...state.symbols, [sourceId]: value }
      };
    }

    case "SET_PAUSE_POINTS": {
      const { sourceText, sourceId, pausePoints } = action;
      const emptyLines = findEmptyLines(sourceText, pausePoints);

      return {
        ...state,
        pausePoints: { ...state.pausePoints, [sourceId]: pausePoints },
        emptyLines: { ...state.emptyLines, [sourceId]: emptyLines }
      };
    }

    case "OUT_OF_SCOPE_LOCATIONS": {
      return { ...state, outOfScopeLocations: action.locations };
    }

    case "IN_SCOPE_LINES": {
      return { ...state, inScopeLines: action.lines };
    }

    case "CLEAR_SELECTION": {
      return { ...state, preview: null };
    }

    case "SET_PREVIEW": {
      if (action.status == "start") {
        return { ...state, preview: { updating: true } };
      }

      if (!action.value) {
        return { ...state, preview: null };
      }

      // NOTE: if the preview does not exist, it has been cleared
      if (state.preview) {
        return { ...state, preview: { ...action.value, updating: false } };
      }

      return state;
    }

    case "RESUME": {
      return { ...state, outOfScopeLocations: null };
    }

    case "NAVIGATE": {
      return initialASTState();
    }

    case "SET_SOURCE_METADATA": {
      const { sourceId, sourceMetaData } = action;
      return {
        ...state,
        sourceMetaData: { ...state.sourceMetaData, [sourceId]: sourceMetaData }
      };
    }

    default: {
      return state;
    }
  }
}

// NOTE: we'd like to have the app state fully typed
// https://github.com/devtools-html/debugger.html/blob/master/src/reducers/sources.js#L179-L185
type OuterState = { ast: ASTState };

export function getSymbols(state: OuterState, source: ?Source): ?Symbols {
  if (!source) {
    return null;
  }

  return state.ast.symbols[source.id] || null;
}

export function hasSymbols(state: OuterState, source: Source): boolean {
  const symbols = getSymbols(state, source);

  if (!symbols) {
    return false;
  }

  return !symbols.loading;
}

export function isSymbolsLoading(state: OuterState, source: ?Source): boolean {
  const symbols = getSymbols(state, source);
  if (!symbols) {
    return false;
  }

  return symbols.loading;
}

export function isEmptyLineInSource(
  state: OuterState,
  line: number,
  selectedSourceId: string
) {
  const emptyLines = getEmptyLines(state, selectedSourceId);
  return emptyLines && emptyLines.includes(line);
}

export function getEmptyLines(state: OuterState, sourceId: string) {
  if (!sourceId) {
    return null;
  }

  return state.ast.emptyLines[sourceId];
}

export function getPausePoints(
  state: OuterState,
  sourceId: string
): ?PausePoints {
  return state.ast.pausePoints[sourceId];
}

export function getPausePoint(
  state: OuterState,
  location: ?SourceLocation
): ?PausePoint {
  if (!location) {
    return;
  }

  const { column, line, sourceId } = location;
  const pausePoints = getPausePoints(state, sourceId);
  if (!pausePoints) {
    return;
  }

  for (const point of pausePoints) {
    const { location: pointLocation } = point;
    if (pointLocation.line == line && pointLocation.column == column) {
      return point;
    }
  }
}

export function hasPausePoints(state: OuterState, sourceId: string): boolean {
  const pausePoints = getPausePoints(state, sourceId);
  return !!pausePoints;
}

export function getOutOfScopeLocations(state: OuterState) {
  return state.ast.outOfScopeLocations;
}

export function getPreview(state: OuterState) {
  return state.ast.preview;
}

const emptySourceMetaData = {};
export function getSourceMetaData(state: OuterState, sourceId: string) {
  return state.ast.sourceMetaData[sourceId] || emptySourceMetaData;
}

export function hasSourceMetaData(state: OuterState, sourceId: string) {
  return state.ast.sourceMetaData[sourceId];
}

export function getInScopeLines(state: OuterState) {
  return state.ast.inScopeLines;
}

export function isLineInScope(state: OuterState, line: number) {
  const linesInScope = state.ast.inScopeLines;
  return linesInScope && linesInScope.includes(line);
}

export default update;
