import * as I from "immutable";
import makeRecord from "../utils/makeRecord";
import { findEmptyLines } from "../utils/ast";

import type {
  AstLocation,
  SymbolDeclarations,
  PausePoints,
  PausePoint
} from "../workers/parser";

import type { Map } from "immutable";
import type { Source, Location } from "../types";
import type { Action, DonePromiseAction } from "../actions/types";
import type { Record } from "../utils/makeRecord";

export function initialComponentsState() {
  return makeRecord(
    ({
      ancestors: null,
      children: {}
    }: ASTState)
  )();
}

function update(
  state: Record<ASTState> = initialComponentsState(),
  action: Action
): Record<ASTState> {
  switch (action.type) {
    case "SET_COMPONENT_ANCESTORS": {
      return state.set("ancestors", action.ancestors);
    }
    case "SET_COMPONENT_CHILDREN": {
      return state.set(
        "children",
        Object.assign({}, state.get("children"), {
          [action.id]: action.children
        })
      );
    }

    default: {
      return state;
    }
  }
}

export function getComponentAncestors(state: OuterState): boolean {
  return state.components.ancestors;
}

export function getComponentChildren(state: OuterState): boolean {
  return state.components.children;
}

export default update;
