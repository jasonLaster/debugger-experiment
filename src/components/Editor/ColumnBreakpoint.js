/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow
import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";
import { getDocument } from "../../utils/editor";
import Svg from "../shared/Svg";
import { showMenu } from "devtools-contextmenu";
import { breakpointItems } from "./menus/items";

// eslint-disable-next-line max-len
import type { ColumnBreakpoint as ColumnBreakpointType } from "../../selectors/visibleColumnBreakpoints";

type Bookmark = {
  clear: Function
};

type Props = {
  editor: Object,
  source: Object,
  enabled: boolean,
  toggleBreakpoint: (number, number) => void,
  columnBreakpoint: ColumnBreakpointType,
  openConditionalPanel: any
};

const breakpointImg = document.createElement("div");
ReactDOM.render(<Svg name={"column-marker"} />, breakpointImg);
function makeBookmark(columnBreakpoint, { onClick, onContextMenu }) {
  const bp = breakpointImg.cloneNode(true);
  const { breakpoint } = columnBreakpoint;
  const condition = breakpoint && breakpoint.condition;
  const isActive = breakpoint && !breakpoint.disabled;

  bp.className = classnames("column-breakpoint", {
    "has-condition": condition,
    active: isActive,
    disabled: !isActive
  });

  if (condition) {
    bp.setAttribute("title", condition);
  }
  bp.onclick = onClick;
  bp.oncontextmenu = onContextMenu;

  return bp;
}

export default class ColumnBreakpoint extends PureComponent<Props> {
  addColumnBreakpoint: Function;
  bookmark: ?Bookmark;

  addColumnBreakpoint = (nextProps: ?Props) => {
    const { columnBreakpoint, source } = nextProps || this.props;

    const sourceId = source.id;
    const doc = getDocument(sourceId);
    if (!doc) {
      return;
    }

    const { line, column } = columnBreakpoint.location;
    const widget = makeBookmark(columnBreakpoint, {
      onClick: this.onClick,
      onContextMenu: this.onContextMenu
    });

    this.bookmark = doc.setBookmark({ line: line - 1, ch: column }, { widget });
  };

  clearColumnBreakpoint = () => {
    if (this.bookmark) {
      this.bookmark.clear();
      this.bookmark = null;
    }
  };

  onClick = event => {
    event.stopPropagation();
    event.preventDefault();
    const {
      columnBreakpoint,
      actions: { toggleBreakpoint }
    } = this.props;
    const { line, column } = columnBreakpoint.location;
    toggleBreakpoint(line, column);
  };

  onContextMenu = event => {
    event.stopPropagation();
    event.preventDefault();
    const {
      columnBreakpoint: { breakpoint, location },
      actions
    } = this.props;
    showMenu(event, breakpointItems({ breakpoint, location, actions }));
  };

  componentDidMount() {
    this.addColumnBreakpoint();
  }

  componentWillUnmount() {
    this.clearColumnBreakpoint();
  }

  componentDidUpdate() {
    this.clearColumnBreakpoint();
    this.addColumnBreakpoint();
  }

  render() {
    return null;
  }
}
