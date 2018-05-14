// @flow

import { getSelectedFrame } from "../../selectors";
import reactComponentTree from "../../utils/reactComponentTree";
import type { ThunkArgs } from "../types";

function getChildren(id: number, evaulate: Function) {
  return evaulate(`
    (${reactComponentTree})().getChildrenFromId(this, ${id})
  `);
}

function getAncestors(evaluate: Function) {
  return evaluate(`(${reactComponentTree})().getAncestors(this)`);
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
      ancestors
    });

    return ancestors;
  };
}

export function fetchComponentChildren(id: number) {
  return async ({ dispatch, getState, client, sourceMaps }: ThunkArgs) => {
    const selectedFrame = getSelectedFrame(getState());
    if (!selectedFrame) {
      return;
    }

    const childrenGrip = await getChildren(id, expr =>
      client.evaluateInFrame(expr, selectedFrame.id)
    );

    const children = await loadArrayItems(client, childrenGrip);

    dispatch({
      type: "SET_COMPONENT_CHILDREN",
      children,
      id: id
    });
  };
}

export function fetchComponentTree() {
  return async ({ dispatch }: ThunkArgs) => {
    const ancestors = await dispatch(fetchComponentAncestors());
    if (!ancestors || ancestors.length == 0) {
      return;
    }
    await Promise.all(
      ancestors.map(ancestor => dispatch(fetchComponentChildren(ancestor.id)))
    );
  };
}
