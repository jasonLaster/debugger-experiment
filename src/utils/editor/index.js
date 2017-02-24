const { isPretty, isJavaScript } = require("../source");
const { isOriginalId } = require("../source-map");
const buildQuery = require("./build-query");
const {
  getDocument,
  setDocument,
  removeDocument,
  clearDocuments
} = require("./source-documents");

const {
  countMatches,
  find,
  findNext,
  findPrev,
  removeOverlay,
  clearIndex
} = require("./source-search");

const SourceEditor = require("./source-editor");

function shouldShowPrettyPrint(selectedSource) {
  if (!selectedSource) {
    return false;
  }

  selectedSource = selectedSource.toJS();
  const _isPretty = isPretty(selectedSource);
  const _isJavaScript = isJavaScript(selectedSource.url);
  const isOriginal = isOriginalId(selectedSource.id);
  const hasSourceMap = selectedSource.sourceMapURL;

  if (_isPretty || isOriginal || hasSourceMap || !_isJavaScript) {
    return false;
  }

  return true;
}

function onKeyDown(codeMirror, e) {
  let { key, target } = e;
  let codeWrapper = codeMirror.getWrapperElement();
  let textArea = codeWrapper.querySelector("textArea");

  if (key === "Escape" && target == textArea) {
    e.stopPropagation();
    e.preventDefault();
    codeWrapper.focus();
  } else if (key === "Enter" && target == codeWrapper) {
    e.preventDefault();
    // Focus into editor's text area
    textArea.focus();
  }
}

function shouldShowFooter(selectedSource, horizontal) {
  if (!horizontal) {
    return true;
  }

  return shouldShowPrettyPrint(selectedSource);
}

function forEachLine(codeMirror, iter) {
  codeMirror.doc.iter(0, codeMirror.lineCount(), iter);
}

function removeLineClass(codeMirror, line, className) {
  codeMirror.removeLineClass(line, "line", className);
}

function clearLineClass(codeMirror, className) {
  forEachLine(codeMirror, line => {
    removeLineClass(codeMirror, line, className);
  });
}

function isTextForSource(sourceText) {
  return !sourceText.get("loading") && !sourceText.get("error");
}

function breakpointAtLine(breakpoints, line) {
  return breakpoints.find(b => {
    return b.location.line === line + 1;
  });
}

function getTextForLine(codeMirror, line) {
  return codeMirror.getLine(line - 1).trim();
}

function getCursorLine(codeMirror) {
  return codeMirror.getCursor().line;
}
/**
 * Forces the breakpoint gutter to be the same size as the line
 * numbers gutter. Editor CSS will absolutely position the gutter
 * beneath the line numbers. This makes it easy to be flexible with
 * how we overlay breakpoints.
 */
function resizeBreakpointGutter(editor) {
  const gutters = editor.display.gutters;
  const lineNumbers = gutters.querySelector(".CodeMirror-linenumbers");
  const breakpoints = gutters.querySelector(".breakpoints");
  breakpoints.style.width = `${lineNumbers.clientWidth}px`;
}

function traverseResults(e, ctx, query, dir, modifiers) {
  e.stopPropagation();
  e.preventDefault();

  if (dir == "prev") {
    findPrev(ctx, query, true, modifiers);
  } else if (dir == "next") {
    findNext(ctx, query, true, modifiers);
  }
}

function createEditor() {
  return new SourceEditor({
    mode: "javascript",
    readOnly: true,
    lineNumbers: true,
    theme: "mozilla",
    lineWrapping: false,
    matchBrackets: true,
    showAnnotationRuler: true,
    enableCodeFolding: false,
    gutters: ["breakpoints", "hit-markers"],
    value: " ",
    extraKeys: {
      // Override code mirror keymap to avoid conflicts with split console.
      Esc: false,
      "Cmd-F": false,
      "Cmd-G": false
    }
  });
}

/**
 * Disable APZ for source editors. It currently causes the line numbers to
 * "tear off" and swim around on top of the content. Bug 1160601 tracks
 * finding a solution that allows APZ to work with CodeMirror.
 */
function onWheel(cm, ev) {
  // By handling the wheel events ourselves, we force the platform to
  // scroll synchronously, like it did before APZ. However, we lose smooth
  // scrolling for users with mouse wheels. This seems acceptible vs.
  // doing nothing and letting the gutter slide around.
  ev.preventDefault();

  let { deltaX, deltaY } = ev;

  if (ev.deltaMode == ev.DOM_DELTA_LINE) {
    deltaX *= cm.defaultCharWidth();
    deltaY *= cm.defaultTextHeight();
  } else if (ev.deltaMode == ev.DOM_DELTA_PAGE) {
    deltaX *= cm.getWrapperElement().clientWidth;
    deltaY *= cm.getWrapperElement().clientHeight;
  }

  cm.getScrollerElement().scrollBy(deltaX, deltaY);
}

module.exports = {
  createEditor,
  onWheel,
  shouldShowPrettyPrint,
  shouldShowFooter,
  clearLineClass,
  onKeyDown,
  buildQuery,
  getDocument,
  setDocument,
  removeDocument,
  clearDocuments,
  countMatches,
  find,
  findNext,
  findPrev,
  clearIndex,
  removeOverlay,
  isTextForSource,
  breakpointAtLine,
  getTextForLine,
  getCursorLine,
  resizeBreakpointGutter,
  traverseResults
};
