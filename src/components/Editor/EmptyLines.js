// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Component } from "react";

import actions from "../../actions";
import { getSelectedSource } from "../../selectors";

import getEmptyLines from "../../utils/parser/getEmptyLines";

import "./EmptyLines.css";

type props = {
  selectedSource: SourceRecord,
  editor: Object
};

class EmptyLines extends Component {
  props: props;

  disableEmptyLines: Function;

  componentDidMount() {
    this.disableEmptyLines();
  }

  componentDidUpdate() {
    this.disableEmptyLines();
  }

  componentWillUnmount() {
    const { selectedSource, editor } = this.props;
    if(!selectedSource) {
      return;
    }

    const emptyLines = getEmptyLines(selectedSource);
    if (!emptyLines) {
      return;
    }

    emptyLines.forEach(line =>
      editor.codeMirror.addLineClass(line, "line", "empty-line")
    );
  }

  disableEmptyLines() {
    const { selectedSource, editor } = this.props;

    const emptyLines = getEmptyLines(selectedSource);
    if (!emptyLines) {
      return;
    }

    emptyLines.forEach(line =>
      editor.codeMirror.addLineClass(line, "line", "empty-line")
    );
  }

  render() {
    return null;
  }
}

EmptyLines.displayName = "EmptyLines";

export default connect(
  state => {
    const selectedSource = getSelectedSource(state);
    return {
      selectedSource
    };
  },
  dispatch => bindActionCreators(actions, dispatch)
)(EmptyLines);
