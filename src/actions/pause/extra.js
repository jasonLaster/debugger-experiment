/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

import { inComponent, getSelectedFrame, getSourceByURL } from "../../selectors";
import { isImmutable } from "../../utils/preview";

import type { ThunkArgs } from "../types";

async function getReactProps(evaluate, client, state, sourceMaps, displayName) {
  function getStack() {}

  const stack = await evaluate(`
    if (this.hasOwnProperty("_reactInternalFiber")) {
      let stack = [];
      let node = this._reactInternalFiber;
      while (node) {
        stack.push({
          name: node.type.name,
          render: node.type.prototype.render
        });
        node = node._debugOwner;
      }
      stack;
    } else {
      [this._reactInternalInstance.getName()];
    }
  `);
  const items = stack.result.preview && stack.result.preview.items;
  let nodes = await Promise.all(items.map(item => client.getProperties(item)));

  nodes = await Promise.all(
    nodes.map(async node => {
      const properties = node.ownProperties;
      const { name, render } = properties;
      const location = render.value.location;
      const source = getSourceByURL(state, location.url);
      const generatedLocation = {
        sourceId: source && source.id,
        line: location.line,
        column: undefined
      };

      const originalLocation = await sourceMaps.getOriginalLocation(
        generatedLocation
      );

      return {
        name: name.value,
        render: {
          generatedLocation,
          originalLocation
        }
      };
    })
  );

  let extra = { displayName };
  if (items) {
    extra = { displayName, componentStack: nodes };
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

async function getExtraProps(
  getState,
  client,
  state,
  sourceMaps,
  expression,
  result,
  evaluate
) {
  const props = {};

  const component = inComponent(getState());

  if (component) {
    props.react = await getReactProps(
      evaluate,
      client,
      state,
      sourceMaps,
      component
    );
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

    const extra = await getExtraProps(
      getState,
      client,
      getState(),
      sourceMaps,
      expression,
      result,
      expr => client.evaluateInFrame(expr, selectedFrame.id)
    );

    return extra;
  };
}
