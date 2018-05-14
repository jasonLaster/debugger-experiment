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
import ManagedTree from "../shared/ManagedTree";

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

  getRoots = () => {
    const { ancestors } = this.props;
    return ancestors.map(ancestor => {
      const name = ancestor.name || ancestor.class;
      return {
        name,
        path: name,
        contents: ancestor
      };
    });
  };

  getChildren = parent => {
    const { children, ancestors } = this.props;
    if (!children) {
      return [];
    }

    const _children = children[parent.contents.id];
    if (!_children) {
      return [];
    }

    return _children
      .filter(child => !ancestors.map(({ id }) => id).includes(child.id))
      .map((child, index) => {
        const name = child.name || child.class;
        return {
          name,
          path: `${parent.path}/${name}-${index}`,
          contents: child,
          parent
        };
      });
  };
  renderTree() {
    const { ancestors } = this.props;
    if (!ancestors || ancestors.length == 0) {
      return <div>empty</div>;
    }

    const treeProps = {
      autoExpandAll: false,
      autoExpandDepth: 0,
      getChildren: this.getChildren,
      getParent: item => item.parent,
      getPath: item => item.path,
      getRoots: this.getRoots,
      highlightItems: [],
      itemHeight: 21,
      key: "full",
      listItems: [],
      onCollapse: () => {},
      onExpand: item => {
        console.log(`on expand`, item);
        this.props.fetchComponentChildren(item.contents.id);
      },
      onFocus: () => {},
      renderItem: (item, depth, c, d) => {
        return (
          <div style={{ paddingLeft: `${depth * 15}px` }}> {item.name}</div>
        );
      }
    };

    return <ManagedTree {...treeProps} />;
  }

  render() {
    return <div className="pane frames">{this.renderTree()}</div>;
  }
}

const mapStateToProps = state => {
  return {
    extra: getExtra(state),
    selectedComponentIndex: getSelectedComponentIndex(state),
    children: getComponentChildren(state),
    ancestors: getComponentAncestors(state)
  };
};

export default connect(mapStateToProps, actions)(ComponentTree);
