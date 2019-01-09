/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

import React, { Component } from "react";

import ColumnBreakpoint from "./ColumnBreakpoint";
import "./ColumnBreakpoints.css";

import { getSelectedSource, visibleColumnBreakpoints } from "../../selectors";
import { connect } from "../../utils/connect";
import { makeLocationId } from "../../utils/breakpoint";
import actions from "../../actions";

import type { Source } from "../../types";
// eslint-disable-next-line max-len
import type { ColumnBreakpoint as ColumnBreakpointType } from "../../selectors/visibleColumnBreakpoints";

class ColumnBreakpoints extends Component {
  props: {
    editor: Object,
    selectedSource: Source,
    columnBreakpoints: ColumnBreakpointType[],
    actions: {
      toggleBreakpoint: typeof actions.toggleBreakpoint,
      toggleDisabledBreakpoint: typeof actions.toggleDisabledBreakpoint,
      openConditionalPanel: typeof actions.openConditionalPanel,
      continueToHere: typeof actions.continueToHere
    }
  };

  render() {
    const {
      editor,
      columnBreakpoints,
      selectedSource,
      toggleBreakpoint,
      toggleDisabledBreakpoint,
      openConditionalPanel,
      continueToHere
    } = this.props;

    const breakpointActions = {
      toggleBreakpoint,
      toggleDisabledBreakpoint,
      openConditionalPanel,
      continueToHere
    };

    if (!selectedSource || selectedSource.isBlackBoxed) {
      return null;
    }

    let breakpoints;
    editor.codeMirror.operation(() => {
      breakpoints = columnBreakpoints.map(breakpoint => (
        <ColumnBreakpoint
          key={makeLocationId(breakpoint.location)}
          columnBreakpoint={breakpoint}
          editor={editor}
          source={selectedSource}
          actions={breakpointActions}
        />
      ));
    });
    return <div>{breakpoints}</div>;
  }
}

const mapStateToProps = state => {
  return {
    selectedSource: getSelectedSource(state),
    columnBreakpoints: visibleColumnBreakpoints(state)
  };
};

const {
  toggleBreakpoin,
  toggleDisabledBreakpoint,
  openConditionalPanel,
  toggleBreakpoint,
  continueToHere
} = actions;
const mapDispatchToProps = {
  toggleBreakpoint,
  toggleDisabledBreakpoint,
  openConditionalPanel,
  toggleBreakpoint,
  continueToHere
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnBreakpoints);
