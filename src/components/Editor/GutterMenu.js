/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

import { Component } from "react";
import { showMenu } from "devtools-contextmenu";
import { connect } from "../../utils/connect";
import { features } from "../../utils/prefs";
import {
  getContextMenu,
  getEmptyLines,
  getSelectedLocation,
  getSelectedSource,
  getVisibleBreakpoints,
  getFirstVisibleBreakpoint,
  isPaused as getIsPaused
} from "../../selectors";

import actions from "../../actions";

type Props = {
  setContextMenu: Function,
  contextMenu: Object
};

export function gutterMenu({
  breakpoint,
  line,
  column,
  event,
  isPaused,
  toggleBreakpoint,
  openConditionalPanel,
  toggleDisabledBreakpoint,
  closeConditionalPanel,
  continueToHere,
  sourceId
}) {
  console.log(">>> inside gutterMenu");

  const location = { line, column, sourceId };

  const toggleBreakpointItem = toggleBreakpointItem({
    toggleBreakpoint,
    closeConditionalPanel,
    breakpoint,
    location
  });

  const conditionalBreakpoint = conditionalBreakpointItem({
    openConditionalPanel,
    breakpoint
  });

  const logPoint = logPointItem({ openConditionalPanel, breakpoint, location });

  let items = [toggleBreakpointItem, conditionalBreakpoint, logPoint];

  if (breakpoint && breakpoint.condition) {
    const remove = breakpoint.log ? conditionalBreakpoint : logPoint;
    items = items.filter(item => item !== remove);
  }

  if (isPaused) {
    const continueToHereItem = items.push(
      continueToHereItem({ continueToHere })
    );
  }

  if (breakpoint) {
    const disableBreakpoint = items.push(
      toggleDisabledBreakpointItem({ toggleDisabledBreakpoint, breakpoint })
    );
  }

  showMenu(event, items);
}

class GutterContextMenuComponent extends Component {
  props: Props;

  shouldComponentUpdate(nextProps) {
    return nextProps.contextMenu && nextProps.contextMenu.type === "Gutter";
  }

  componentDidUpdate() {}

  componentDidMount() {
    if (this.shouldComponentUpdate(this.props)) {
      this.showMenu(this.props);
    }
  }

  componentWillUpdate(nextProps) {
    this.props.clearContextMenu();
    return this.showMenu(nextProps);
  }

  showMenu(nextProps) {
    const { contextMenu, ...props } = nextProps;
    let {
      event,
      location: { line, column, sourceId }
    } = contextMenu;

    console.log(">> showMenu");

    const breakpoint = nextProps.breakpoints.find(
      bp => bp.location.line === line
    );

    if (features.columnBreakpoints && !breakpoint) {
      column = undefined;
    }

    gutterMenu({ event, sourceId, line, column, breakpoint, ...props });
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state, { contextMenu }) => {
  const selectedSource = getSelectedSource(state);
  console.log(
    ">> oh yea",
    contextMenu,
    getFirstVisibleBreakpoint(state, contextMenu.location)
  );
  return {
    selectedLocation: getSelectedLocation(state),
    selectedSource: selectedSource,
    breakpoints: getVisibleBreakpoints(state),
    // firstBreakpoint: getFirstVisibleBreakpoint(state, contextMenu.location),
    isPaused: getIsPaused(state),
    contextMenu: getContextMenu(state),
    emptyLines: getEmptyLines(state, selectedSource.id)
  };
};

export default connect(
  mapStateToProps,
  actions
)(GutterContextMenuComponent);
