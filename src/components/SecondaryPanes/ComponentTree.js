/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import actions from "../../actions";
import classNames from "classnames";

import {
  getExtra,
  getSelectedComponentIndex,
  getComponentChildren,
  getComponentAncestors,
  getSelectedFrame
} from "../../selectors";

import "./Frames/Frames.css";

type Props = {
  extra: Object,
  selectedComponentIndex: number,
  selectComponent: Function,
  children: Object[],
  ancestors: Object[]
};

class ComponentTree extends PureComponent<Props> {
  onMouseDown(e: SyntheticKeyboardEvent<HTMLElement>, componentIndex: number) {
    if (e.nativeEvent.which == 3) {
      return;
    }
    this.props.selectComponent(componentIndex);
  }

  renderAncestors() {
    const { ancestors, children } = this.props;
    if (!ancestors) {
      return null;
    }

    return (
      <ul>
        {ancestors
          .slice()
          .reverse()
          .map(({ name }, index) => (
            <li
              className={classNames("frame", {
                selected: this.props.selectedComponentIndex === index
              })}
              key={index}
              onMouseDown={e => this.onMouseDown(e, index)}
            >
              {name}
            </li>
          ))}
      </ul>
    );
  }

  renderChildren() {
    const { children } = this.props;
    if (!children) {
      return null;
    }

    return (
      <ul style={{ borderTop: "1px solid #999" }}>
        {children.slice().map(({ name, class: klass }, index) => (
          <li
            key={index}
            className={classNames("frame", {
              selected: this.props.selectedComponentIndex === index
            })}
            key={index}
            onMouseDown={e => this.onMouseDown(e, index)}
          >
            {name || klass}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div className="pane frames">
        {this.renderAncestors()}
        {this.renderChildren()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const selectedFrame = getSelectedFrame(state);
  if (!selectedFrame) {
    return {};
  }
  return {
    extra: getExtra(state),
    selectedComponentIndex: getSelectedComponentIndex(state),
    children: getComponentChildren(state, selectedFrame.this),
    ancestors: getComponentAncestors(state, selectedFrame.this)
  };
};

export default connect(mapStateToProps, actions)(ComponentTree);
