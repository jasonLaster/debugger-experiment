// @flow

import { getSelectedFrame } from "../../selectors";

import type { ThunkArgs } from "../types";

function getChildren(evaulate: Function) {
  return evaulate(`
    if (this._reactInternalInstance) {
      []
    } else {
      this._reactInternalFiber.child.memoizedProps.children
        .filter(Boolean)
        .map(child => ({ name: child.type && child.type.name, child, class: child.type }))
    }
  `);
}

function getAncestors(evaluate: Function) {
  return evaluate(`
    if(this.hasOwnProperty('_reactInternalFiber')) {
      let ancestors = [];
      let node = this._reactInternalFiber;
      while(node) {
        ancestors.push({ name: node.type.name, node, class: node.type });
        node = node._debugOwner
      }
      ancestors;
    }
    else {
      [this._reactInternalInstance.getName()];
    }
  `);
}

//
// async function getReactProps(evaluate, displayName): ExtraReact {
//   const ancestors = await getAncestors(evaluate);
//   const children = await getChildren(evaluate);
//
//   let extra = { displayName };
//   if (children) {
//     extra.children = children;
//   }
//   if (ancestors) {
//     extra.ancestors = ancestors;
//   }
//
//   return extra;
// }

async function loadArrayItems(client, arrayGrip) {
  if (!arrayGrip || !arrayGrip.result.preview.items) {
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

    if (!childrenGrip || !childrenGrip.result.preview.items) {
      return;
    }

    const children = await client.getProperties(
      childrenGrip.result.preview.items
    );

    dispatch({
      type: "SET_COMPONENT_CHILDREN",
      children
    });
  };
}
