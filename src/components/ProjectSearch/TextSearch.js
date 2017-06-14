import { Component, DOM as dom, createFactory } from "react";
import classnames from "classnames";

import Svg from "../shared/Svg";
import _ManagedTree from "../shared/ManagedTree";
const ManagedTree = createFactory(_ManagedTree);

import _SearchInput from "../shared/SearchInput";
const SearchInput = createFactory(_SearchInput);

import "./TextSearch.css";

export default class TextSearch extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: props.inputValue || "",
      selectedIndex: 0,
      focused: false
    };
  }

  renderFile(file, expanded) {
    return dom.div(
      {
        className: "file-result"
      },
      Svg("arrow", {
        className: classnames({
          expanded
        })
      }),
      file.filepath
    );
  }

  renderLine(match) {
    return dom.div(
      { className: "result" },
      dom.span(
        {
          className: "line-number"
        },
        match.line
      ),
      dom.span({ className: "line-match" }, match.value)
    );
  }

  renderResults() {
    const results = [];
    return ManagedTree({
      getRoots: () => results,
      getChildren: file => {
        return file.matches || [];
      },
      itemHeight: 20,
      autoExpand: 1,
      autoExpandDepth: 1,
      getParent: item => null,
      getKey: item => item.filepath || `${item.value}/${item.line}`,
      renderItem: (item, depth, focused, _, expanded) =>
        item.filepath ? this.renderFile(item, expanded) : this.renderLine(item)
    });
  }

  renderInput() {
    const searchResults = [];
    const summaryMsg = L10N.getFormatStr(
      "sourceSearch.resultsSummary1",
      searchResults.length
    );

    return SearchInput({
      query: this.state.inputValue,
      count: searchResults.length,
      placeholder: "YO YO",
      size: "big",
      summaryMsg,
      onChange: e =>
        this.setState({
          inputValue: e.target.value,
          selectedIndex: 0
        }),
      onFocus: () => this.setState({ focused: true }),
      onBlur: () => this.setState({ focused: false }),
      onKeyDown: this.onKeyDown,
      handleClose: this.props.close
    });
  }

  render() {
    return dom.div(
      {
        className: "project-text-search"
      },
      this.renderInput(),
      this.renderResults()
    );
  }
}

TextSearch.displayName = "TextSearch";
