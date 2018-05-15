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
      children: {},
      selectedComponentId: null
    }: ASTState)
  )();
}

function update(
  state: Record<ASTState> = initialComponentsState(),
  action: Action
): Record<ASTState> {
  switch (action.type) {
    case "SELECT_COMPONENT": {
      return state.set("selectedComponentId", action.id);
    }
    case "SET_COMPONENT_ANCESTORS": {
      return state.set("ancestors", action.ancestors);
    }
    case "SELECT_FRAME": {
      return state.set("selectedComponentId", null);
    }
    case "RESUME":
      return state.set("ancestors", null).set("selectedComponentId", null);

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

export function getSelectedComponentId(state: OuterState) {
  return state.components.selectedComponentId;
}

export function getSelectedComponent(state: OuterState) {
  return (getComponentAncestors(state) || []).find(
    ancestor => ancestor.id == state.components.selectedComponentId
  );
}

export default update;
