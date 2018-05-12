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
      ancestors: I.Map(),
      children: I.Map()
    }: ASTState)
  )();
}

function update(
  state: Record<ASTState> = initialComponentsState(),
  action: Action
): Record<ASTState> {
  switch (action.type) {
    case "SET_COMPONENT_ANCESTORS": {
      return state.setIn(["ancestors", action.this.actor], action.ancestors);
    }
    case "SET_COMPONENT_CHILDREN": {
      return state.setIn(["children", action.this.actor], action.ancestors);
    }

    default: {
      return state;
    }
  }
}

export function getComponentAncestors(
  state: OuterState,
  objectId: string
): boolean {
  return state.components.getIn("ancestors", objectId);
}

export function getComponentChildren(
  state: OuterState,
  objectId: string
): boolean {
  return state.components.getIn("children", objectId);
}
export default update;
