// @flow

import { getSelectedFrame } from "../../selectors";

import type { ThunkArgs } from "../types";

function getChildren(evaulate: Function) {
  return evaulate(`
    if(this.hasOwnProperty('_reactInternalFiber')) {
      if (!this._reactInternalFiber.child) {
        []
      } else {
        this._reactInternalFiber.child.memoizedProps.children
          .filter(Boolean)
          .map(child => ({
            name: (child.type && child.type.name) || "",
            child,
            class: child.type
          }))
      }
    } else {
      []
    }
  `);
}

function getAncestors(evaluate: Function) {
  return evaluate(`
    if(this.hasOwnProperty('_reactInternalFiber')) {
      let ancestors = [];
      let node = this._reactInternalFiber;
      while(node) {
        ancestors.push({ name: node.type.name || "", node, class: node.type });
        node = node._debugOwner
      }
      ancestors;
    }
    else {
      [this._reactInternalInstance.getName()];
    }
  `);
}

async function loadArrayItems(client, arrayGrip) {
  if (
    !arrayGrip ||
    !arrayGrip.result.preview ||
    !arrayGrip.result.preview.items
  ) {
    console.log(`> bad array`, arrayGrip);
    return;
  }
  const items = arrayGrip.result.preview.items;
  const itemGrips = await Promise.all(
    items.map(item => client.getProperties(item))
  );

  return itemGrips.map(itemGrip =>
    Object.entries(itemGrip.ownProperties)
      .map(([k, v]) => [k, v.value])
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {})
  );
}

export function fetchComponentAncestors() {
  return async ({ dispatch, getState, client, sourceMaps }: ThunkArgs) => {
    const selectedFrame = getSelectedFrame(getState());
    if (!selectedFrame) {
      return;
    }

    const ancestorsGrip = await getAncestors(expr =>
      client.evaluateInFrame(expr, selectedFrame.id)
    );

    const ancestors = await loadArrayItems(client, ancestorsGrip);

    dispatch({
      type: "SET_COMPONENT_ANCESTORS",
      ancestors,
      this: selectedFrame.this
    });
  };
}

export function fetchComponentChildren() {
  return async ({ dispatch, getState, client, sourceMaps }: ThunkArgs) => {
    const selectedFrame = getSelectedFrame(getState());
    if (!selectedFrame) {
      return;
    }

    const childrenGrip = await getChildren(expr =>
      client.evaluateInFrame(expr, selectedFrame.id)
    );

    const children = await loadArrayItems(client, childrenGrip);

    dispatch({
      type: "SET_COMPONENT_CHILDREN",
      children,
      this: selectedFrame.this
    });
  };
}

export function fetchComponentTree() {
  return async ({ dispatch }: ThunkArgs) => {
    await dispatch(fetchComponentChildren());
    await dispatch(fetchComponentAncestors());
  };
}
