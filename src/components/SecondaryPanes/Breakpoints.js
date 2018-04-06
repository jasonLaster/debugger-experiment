/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as I from "immutable";
import { createSelector } from "reselect";
import { groupBy, sortBy } from "lodash";

import BreakpointItem from "./BreakpointItem";

import actions from "../../actions";
import { getFilename } from "../../utils/source";
import {
  getSources,
  getSourceInSources,
  getBreakpoints,
  getPauseReason,
  getTopFrame
} from "../../selectors";
import { isInterrupted } from "../../utils/pause";
import { makeLocationId } from "../../utils/breakpoint";
import showContextMenu from "./BreakpointsContextMenu";

import type { Breakpoint, Location, Source, Frame, Why } from "../../types";

import "./Breakpoints.css";

export type LocalBreakpoint = Breakpoint & {
  location: Location,
  isCurrentlyPaused: boolean,
  locationId: string,
  source: Source
};

type BreakpointsMap = I.Map<string, LocalBreakpoint>;

type Props = {
  breakpoints: BreakpointsMap,
  enableBreakpoint: Location => void,
  disableBreakpoint: Location => void,
  selectLocation: Object => void,
  removeBreakpoint: string => void,
  removeAllBreakpoints: () => void,
  removeBreakpoints: BreakpointsMap => void,
  toggleBreakpoints: (boolean, BreakpointsMap) => void,
  toggleAllBreakpoints: boolean => void,
  toggleDisabledBreakpoint: number => void,
  setBreakpointCondition: Location => void,
  openConditionalPanel: number => void
};

function getBreakpointFilename(source: Source) {
  return source ? getFilename(source) : "";
}

class Breakpoints extends Component<Props> {
  shouldComponentUpdate(nextProps, nextState) {
    const { breakpoints } = this.props;
    return breakpoints !== nextProps.breakpoints;
  }

  handleCheckbox(breakpoint) {
    if (breakpoint.loading) {
      return;
    }

    if (breakpoint.disabled) {
      this.props.enableBreakpoint(breakpoint.location);
    } else {
      this.props.disableBreakpoint(breakpoint.location);
    }
  }

  selectBreakpoint(breakpoint) {
    this.props.selectLocation(breakpoint.location);
  }

  removeBreakpoint(event, breakpoint) {
    event.stopPropagation();
    this.props.removeBreakpoint(breakpoint.location);
  }

  renderEmpty() {
    return <div className="pane-info">{L10N.getStr("breakpoints.none")}</div>;
  }

  renderBreakpoint(breakpoint, source) {
    const { frame, why } = this.props;
    return (
      <BreakpointItem
        key={breakpoint.locationId}
        breakpoint={breakpoint}
        source={source}
        frame={frame}
        why={why}
        onClick={() => this.selectBreakpoint(breakpoint)}
        onContextMenu={e =>
          showContextMenu({ ...this.props, breakpoint, contextMenuEvent: e })
        }
        onChange={() => this.handleCheckbox(breakpoint)}
        onCloseClick={ev => this.removeBreakpoint(ev, breakpoint)}
      />
    );
  }

  renderBreakpointGroup(source) {
    const { breakpoints } = this.props;

    const filename = getFilename(source);
    const sourceBreakpoints = getBreakpointsForSource(source, breakpoints);

    return [
      <div className="breakpoint-heading" title={filename} key={filename}>
        {filename}
      </div>,
      ...sourceBreakpoints.map(bp => this.renderBreakpoint(bp))
    ];
  }

  renderBreakpoints() {
    const { sources } = this.props;
    return sources.valueSeq().map(this.renderBreakpointGroup);
  }

  render() {
    const { breakpoints } = this.props;

    return (
      <div className="pane breakpoints-list">
        {breakpoints.size ? this.renderBreakpoints() : this.renderEmpty()}
      </div>
    );
  }
}

function getBreakpointsForSource(source, breakpoints) {
  return breakpoints.filter(
    breakpoint => breakpoint.location.sourceId == source.id
  );
}

const _getBreakpoints = createSelector(
  getBreakpoints,
  getSources,
  getTopFrame,
  getPauseReason,
  (breakpoints, sources, frame, why) => {
    return breakpoints.filter(
      breakpoint => breakpoint.text && !breakpoint.hidden
    );
  }
);

const getBreakpointSources = createSelector(
  getBreakpoints,
  getSources,
  (breakpoints, sources) => {
    const bpSourceIds = breakpoints.map(bp => bp.location.sourceId).uniq();
    return bpSourceIds
      .map(sourceId => sources.get(sourceId))
      .filter(source => !source.isBlackBoxed);
  }
);

export default connect(
  (state, props) => ({
    breakpoints: _getBreakpoints(state),
    sources: getBreakpointSources(state),
    frame: getTopFrame(state),
    why: getPauseReason(state)
  }),
  dispatch => bindActionCreators(actions, dispatch)
)(Breakpoints);
