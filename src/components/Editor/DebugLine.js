// @flow
import { PureComponent } from "react";
import { getDocument } from "../../utils/editor";

type DebugLineProps = {
  sourceId: string,
  selectedFrame: Frame
};

function getFrameLocation(frame: Frame) {
  return frame.location;
}

function getFrameLine(frame: Frame) {
  return frame.location.line;
}

let debugExpression;

class DebugLine extends PureComponent {
  props: DebugLineProps;

  componentDidUpdate(prevProps: DebugLineProps) {
    this.clearDebugLine(prevProps.selectedFrame);
    this.setDebugLine();
  }

  componentDidMount() {
    this.setDebugLine();
  }

  componentWillUnmount() {
    this.clearDebugLine(this.props.selectedFrame);
  }

  clearDebugLine(frame: Frame) {
    const { sourceId } = this.props;
    const line = getFrameLine(frame);
    let editorLine = toEditorLine(sourceId, line);

    if (debugExpression) {
      debugExpression.clear();
    }

    getDocument(sourceId).removeLineClass(editorLine, "line", "new-debug-line");
  }

  setDebugLine() {
    const { sourceId, selectedFrame, editor } = this.props;
    const { line, column } = toEditorPosition(
      sourceId,
      getFrameLocation(selectedFrame)
    );

    debugExpression = markText(editor, "debug-expression", {
      start: { line, column },
      end: { line, column: null }
    });

    getDocument(sourceId).addLineClass(line - 1, "line", "new-debug-line");
  }

  render() {
    return null;
  }
}

DebugLine.displayName = "DebugLine";

export default DebugLine;
