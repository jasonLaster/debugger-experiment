// @flow
import { PropTypes, Component } from "react";
import { isEnabled } from "devtools-config";
const ReactDOM = require("react-dom");
import classnames from "classnames";
import range from "lodash/range";

class HighlightFunction extends Component {
  addHighlightFunction: Function;

  constructor() {
    super();
    this.highlightFunction = this.highlightFunction.bind(this);
  }

  highlightFunction() {
    const { highlightedFunction, editor } = this.props;
    if (!highlightedFunction) {
      return;
    }

    const { start, end } = highlightedFunction.location;

    range(start.line, end.line).forEach(line => {
      editor.addLineClass(line, "line", "highlight-line");
    });

    // if (bp.condition) {
    //   this.props.editor.addLineClass(line, "line", "has-condition");
    // } else {
    //   this.props.editor.removeLineClass(line, "line", "has-condition");
    // }
  }

  // shouldComponentUpdate(nextProps: any) {
  //   return (
  //     this.props.editor !== nextProps.editor ||
  //     (this.props.highlightedFunction &&
  //       this.props.highlightedFunction.displayName !==
  //         nextProps.highlightedFunction.displayName)
  //   );
  // }

  componentDidMount() {
    if (!this.props.editor) {
      return;
    }

    this.highlightFunction();
  }

  componentDidUpdate() {
    this.highlightFunction();
  }

  componentWillUnmount() {
    if (!this.props.editor) {
      return;
    }

    const { highlightedFunction, editor } = this.props;
    const { start, end } = highlightedFunction.location;

    range(start.line, end.line).forEach(line => {
      editor.removeLineClass(line, "line", "highlight-line");
    });

    // this.props.editor.setGutterMarker(line, "breakpoints", null);
    // this.props.editor.removeLineClass(line, "line", "new-breakpoint");
    // this.props.editor.removeLineClass(line, "line", "has-condition");
  }

  render() {
    return null;
  }
}

HighlightFunction.propTypes = {
  highlightedFunction: PropTypes.object,
  editor: PropTypes.object
};

HighlightFunction.displayName = "HighlightFunction";

export default HighlightFunction;
