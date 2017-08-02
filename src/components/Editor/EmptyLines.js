// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Component } from "react";

import actions from "../../actions";
import { getSelectedSource } from "../../selectors";

import { getEmptyLines } from "../../utils/parser";

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

  async componentWillUnmount() {
    const { selectedSource, editor } = this.props;
    if (!selectedSource) {
      return;
    }

    const emptyLines = await getEmptyLines(selectedSource.toJS());
    if (!emptyLines) {
      return;
    }

    emptyLines.forEach(line =>
      editor.codeMirror.addLineClass(line, "line", "empty-line")
    );
  }

  async disableEmptyLines() {
    const { selectedSource, editor } = this.props;

    if (!selectedSource) {
      return;
    }

    const emptyLines = await getEmptyLines(selectedSource.toJS());
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
