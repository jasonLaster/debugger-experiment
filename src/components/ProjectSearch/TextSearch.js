// @flow

import React, { Component, DOM as dom, PropTypes } from "react";
import classnames from "classnames";

import escapeRegExp from "lodash/escapeRegExp";
import Svg from "../shared/Svg";

import ManagedTree from "../shared/ManagedTree";
import SearchInput from "../shared/SearchInput";

import "./TextSearch.css";

import { getRelativePath } from "../../utils/sources-tree";

import type { Match } from "../../utils/search/project-search";
import type { Item } from "../shared/ManagedTree";

type Result = {
  filepath: string,
  matches: Match[]
};

type Results = Result[];

type Props = {
  results: Results,
  query: string,
  closeActiveSearch: () => void,
  searchSources: () => void,
  selectSource: () => void,
  searchBottomBar: any
};

type State = {
  inputValue: string,
  focused: boolean
};

export default class TextSearch extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: this.props.query || "",
      focused: false
    };

    this.focused = null;

    this.inputOnChange = this.inputOnChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onEnterPress = this.onEnterPress.bind(this);
    this.close = this.close.bind(this);
    this.selectMatchItem = this.selectMatchItem.bind(this);
  }

  close() {
    this.props.closeActiveSearch();
  }

  async onKeyDown(e: Element) {
    if (e.key !== "Enter") {
      return;
    }
    this.props.searchSources(this.state.inputValue);
  }

  onEnterPress() {
    if (this.focused) {
      const { setExpanded, file, expanded, match } = this.focused;
      if (setExpanded) {
        setExpanded(file, !expanded);
      } else {
        this.selectMatchItem(match);
      }
    }
  }

  componentWillUnmount() {
    const shortcuts = this.context.shortcuts;
    shortcuts.off("Enter", this.onEnterPress);
  }

  componentDidMount() {
    const shortcuts = this.context.shortcuts;
    shortcuts.on("Enter", this.onEnterPress);
  }

  inputOnChange(e) {
    const inputValue = e.target.value;
    this.setState({ inputValue });
  }

  selectMatchItem(matchItem) {
    this.props.selectSource(matchItem.sourceId, { line: matchItem.line });
  }

  getResults() {
    const { results } = this.props;
    return results
      .filter(result => result.filepath && result.matches.length > 0)
      .map(result => ({
        name: result.filepath,
        path: result.filepath,
        contents: result.matches
      }));
  }

  resultCount() {
    const results = this.getResults();
    return results.reduce(
      (count, file) => count + (file.contents ? file.contents.length : 0),
      0
    );
  }

  renderFile(
    file: Item,
    focused: boolean,
    expanded: boolean,
    setExpanded: () => void
  ) {
    if (focused) {
      this.focused = { setExpanded, file, expanded };
    }

    const svgArrow = Svg("arrow", {
      className: classnames({
        expanded
      })
    });

    const svgFile = Svg("file");

    const matches = ` (${file.contents.length} match${file.contents.length > 1
      ? "es"
      : ""})`;

    return (
      <div
        className={classnames("file-result", { focused })}
        key={file.sourceId}
        onClick={e => setExpanded(file, !expanded)}
      >
        {svgArrow}
        {svgFile}
        <span className="file-path">
          {getRelativePath(file.filepath)}
        </span>
        <span className="matches-summary">
          {matches}
        </span>
      </div>
    );
  }

  renderMatch(match: Item, focused: boolean) {
    if (focused) {
      this.focused = { match };
    }
    return (
      <div
        className={classnames("result", { focused })}
        onClick={() => setTimeout(() => this.selectMatchItem(match), 50)}
      >
        <span className="line-number" key={match.line}>
          {match.line}
        </span>
        {this.renderMatchValue(match.value)}
      </div>
    );
  }

  renderMatchValue(value: string) {
    const { inputValue } = this.state;
    let match;
    const len = inputValue.length;
    let matchIndexes = [];
    let matches = [];
    const re = new RegExp(escapeRegExp(inputValue), "g");
    while ((match = re.exec(value)) !== null) {
      matchIndexes.push(match.index);
    }

    matchIndexes.forEach((matchIndex, index) => {
      if (matchIndex > 0 && index === 0) {
        matches.push(
          <span className="line-match">
            {value.slice(0, matchIndex)}
          </span>
        );
      }
      if (matchIndex > matchIndexes[index - 1] + len) {
        matches.push(
          <span className="line-match">
            {value.slice(matchIndexes[index - 1] + len, matchIndex)}
          </span>
        );
      }
      matches.push(
        <span className="query-match" key={index}>
          {value.substr(matchIndex, len)}
        </span>
      );
      if (index === matchIndexes.length - 1) {
        matches.push(
          <span className="line-match">
            {value.slice(matchIndex + len, value.length)}
          </span>
        );
      }
    });

    return dom.span({ className: "line-value" }, ...matches);
  }

  renderResults() {
    const results = this.getResults();
    function getFilePath(item: Match) {
      return item.filepath
        ? `${item.sourceId}`
        : `${item.sourceId}-${item.line}-${item.column}`;
    }

    const renderItem = (item, depth, focused, _, expanded, { setExpanded }) => {
      return item.filepath
        ? this.renderFile(item, focused, expanded, setExpanded)
        : this.renderMatch(item, focused);
    };

    return (
      <ManagedTree
        getRoots={() => results}
        getChildren={file => file.contents}
        itemHeight={20}
        autoExpand={1}
        autoExpandDepth={1}
        focused={results[0]}
        getParent={item => null}
        getPath={getFilePath}
        renderItem={renderItem}
        autoExpandAll={false}
      />
    );
  }

  renderInput() {
    const resultCount = this.resultCount();
    const summaryMsg = L10N.getFormatStr(
      "sourceSearch.resultsSummary1",
      resultCount
    );

    return (
      <SearchInput
        query={this.state.inputValue}
        count={resultCount}
        placeholder={L10N.getStr("projectTextSearch.placeholder")}
        size="big"
        summaryMsg={summaryMsg}
        onChange={e => this.inputOnChange(e)}
        onFocus={() => this.setState({ focused: true })}
        onBlur={() => this.setState({ focused: false })}
        onKeyDown={e => this.onKeyDown(e)}
        handleClose={this.close}
        ref="searchInput"
      />
    );
  }

  render() {
    const { searchBottomBar } = this.props;
    return (
      <div className="project-text-search">
        <div className="header">
          {this.renderInput()}
          {searchBottomBar}
        </div>
        {this.renderResults()}
      </div>
    );
  }
}

TextSearch.contextTypes = {
  shortcuts: PropTypes.object
};

TextSearch.displayName = "TextSearch";
