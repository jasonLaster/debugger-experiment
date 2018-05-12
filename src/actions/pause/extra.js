/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

import { inComponent, getSelectedFrame } from "../../selectors";
import { isImmutable } from "../../utils/preview";

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
        ancestors.push({ name: node.type.name, node });
        node = node._debugOwner
      }
      ancestors;
    }
    else {
      [this._reactInternalInstance.getName()];
    }
  `);
}

type ExtraReact = {
  displayName: string,
  children?: Object[],
  ancestors?: Object[]
};

async function getReactProps(evaluate, displayName): ExtraReact {
  const ancestors = await getAncestors(evaluate);
  const children = await getChildren(evaluate);

  let extra = { displayName };
  if (children) {
    extra.children = children;
  }
  if (ancestors) {
    extra.ancestors = ancestors;
  }

  return extra;
}

async function getImmutableProps(expression: string, evaluate) {
  const immutableEntries = await evaluate((exp => `${exp}.toJS()`)(expression));

  const immutableType = await evaluate(
    (exp => `${exp}.constructor.name`)(expression)
  );

  return {
    type: immutableType.result,
    entries: immutableEntries.result
  };
}

async function getExtraProps(getState, expression, result, evaluate) {
  const props = {};

  const component = inComponent(getState());

  if (component) {
    props.react = await getReactProps(evaluate, component);
  }

  if (isImmutable(result)) {
    props.immutable = await getImmutableProps(expression, evaluate);
  }

  return props;
}

export function fetchExtra() {
  return async function({ dispatch, getState }: ThunkArgs) {
    const frame = getSelectedFrame(getState());
    const extra = await dispatch(getExtra("this;", frame.this));
    dispatch({
      type: "ADD_EXTRA",
      extra: extra
    });
  };
}

export function getExtra(expression: string, result: Object) {
  return async ({ dispatch, getState, client, sourceMaps }: ThunkArgs) => {
    const selectedFrame = getSelectedFrame(getState());
    if (!selectedFrame) {
      return;
    }

    const extra = await getExtraProps(getState, expression, result, expr =>
      client.evaluateInFrame(expr, selectedFrame.id)
    );

    return extra;
  };
}
