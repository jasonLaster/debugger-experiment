/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import actions from "../../actions";
import classnames from "classnames";

import {
  getExtra,
  getSelectedComponentIndex,
  getComponentChildren,
  getComponentAncestors,
  getSelectedFrame
} from "../../selectors";
import ManagedTree from "../shared/ManagedTree";

import "./ComponentTree.css";

type Props = {
  extra: Object,
  selectedComponentIndex: number,
  selectComponent: Function,
  children: Object[],
  ancestors: Object[]
};

class ComponentTree extends PureComponent<Props> {
  childrenNodes = {};
  onMouseDown(e: SyntheticKeyboardEvent<HTMLElement>, componentIndex: number) {
    if (e.nativeEvent.which == 3) {
      return;
    }
    this.props.selectComponent(componentIndex);
  }

  getRoots = () => {
    const { ancestors } = this.props;
    const root = ancestors[0];

    return [
      {
        name: root.name,
        path: root.name,
        contents: root
      }
    ];
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

    if (this.childrenNodes[parent.contents.id]) {
      return this.childrenNodes[parent.contents.id];
    }

    this.childrenNodes[parent.contents.id] = _children.map((child, index) => {
      const name = child.name || child.class;
      return {
        name,
        path: `${parent.path}/${name}-${index}`,
        contents: child,
        parent
      };
    });

    return this.childrenNodes[parent.contents.id];
  };

  selectComponent = (event, item) => {
    if (item && item.contents.class && item.contents.class.location) {
      this.props.selectVisibleLocation(item.contents.class.location);
      event.preventDefault();
      event.stopPropagation();
    }
  };

  renderItem = (item, depth, focused, _, expanded, { setExpanded }) => {
    const arrow = item.contents.hasChildren ? (
      <img
        className={classnames("arrow", {
          expanded: expanded
        })}
      />
    ) : (
      <i className="no-arrow" />
    );

    return (
      <div
        className={classnames("node", { focused })}
        key={item.path}
        onClick={e => {}}
        onContextMenu={e => {}}
      >
        {arrow}
        <span className="label" onClick={e => this.selectComponent(e, item)}>
          {" "}
          {item.name}{" "}
        </span>
      </div>
    );
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
      onCollapse: item => {
        console.log(`on collapse`, item);
      },
      onExpand: item => {
        console.log(`on expand`, item);
        this.props.fetchComponentChildren(item.contents.id);
      },
      onFocus: item => {
        console.log(`on focus`, item);
      },
      renderItem: this.renderItem
    };

    return <ManagedTree {...treeProps} />;
  }

  render() {
    return <div className="pane component-tree">{this.renderTree()}</div>;
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
