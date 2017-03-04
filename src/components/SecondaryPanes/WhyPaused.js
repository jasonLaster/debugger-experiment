// @flow
import { DOM as dom, Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import actions from "../../actions";
import { getPause } from "../../selectors";
const get = require("lodash/get");

import { getPauseReason } from "../../utils/pause";

import "./WhyPaused.css";

class WhyPaused extends Component {

  renderMessage(pauseInfo) {
    if (!pauseInfo) {
      return null;
    }

    const message = get(pauseInfo, "why.message", "");
    if (!message) {
      return null;
    }

    return dom.div(null, message);
  }

  render() {
    const { pauseInfo } = this.props;
    const reason = getPauseReason(pauseInfo);

    if (!reason) {
      return null;
    }

    return dom.div(
      { className: "pane why-paused" },
      dom.div(null, L10N.getStr(reason)),
      this.renderMessage(pauseInfo)
    );
  }
}

WhyPaused.displayName = "WhyPaused";

WhyPaused.propTypes = {
  pauseInfo: PropTypes.object
};

export default connect(
  state => ({
    pauseInfo: getPause(state)
  }),
  dispatch => bindActionCreators(actions, dispatch)
)(WhyPaused);
