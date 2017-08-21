// @flow
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import actions from "../../actions";
import { getWorkers } from "../../selectors";
import "./Workers.css";

import type {} from "debugger-html";

class Workers extends Component {
  props: {};

  constructor(...args) {
    super(...args);
  }

  renderListener({ type, selector, line, sourceId, breakpoint }) {
    return (
      <div className="worker" onClick={() => {}} key={""}>
        <span className="type">
          {type}
        </span>
        <span className="selector">
          {selector}
        </span>
      </div>
    );
  }

  render() {
    const { workers } = this.props;
    return (
      <div className="pane workers">
        {workers.map(this.renderListener)}
      </div>
    );
  }
}

Workers.displayName = "Workers";

export default connect(
  state => ({
    listeners: getWorkers(state)
  }),
  dispatch => bindActionCreators(actions, dispatch)
)(Workers);
