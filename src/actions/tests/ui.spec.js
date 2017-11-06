import { createStore, selectors, actions } from "../../utils/test-head";

const {
  getActiveSearch,
  getFrameworkGroupingState,
  getPaneCollapse,
  getHighlightedLineRange,
  getProjectDirectoryRoot
} = selectors;

describe("ui", () => {
  it("should toggle the visible state of project search", () => {
    const { dispatch, getState } = createStore();
    expect(getActiveSearch(getState())).toBe(null);
    dispatch(actions.setActiveSearch("project"));
    expect(getActiveSearch(getState())).toBe("project");
  });

  it("should close project search", () => {
    const { dispatch, getState } = createStore();
    expect(getActiveSearch(getState())).toBe(null);
    dispatch(actions.setActiveSearch("project"));
    dispatch(actions.closeActiveSearch());
    expect(getActiveSearch(getState())).toBe(null);
  });

  it("should toggle the visible state of file search", () => {
    const { dispatch, getState } = createStore();
    expect(getActiveSearch(getState())).toBe(null);
    dispatch(actions.setActiveSearch("file"));
    expect(getActiveSearch(getState())).toBe("file");
  });

  it("should close file search", () => {
    const { dispatch, getState } = createStore();
    expect(getActiveSearch(getState())).toBe(null);
    dispatch(actions.setActiveSearch("file"));
    dispatch(actions.closeActiveSearch());
    expect(getActiveSearch(getState())).toBe(null);
  });

  it("should toggle the collapse state of a pane", () => {
    const { dispatch, getState } = createStore();
    expect(getPaneCollapse(getState(), "start")).toBe(false);
    dispatch(actions.togglePaneCollapse("start", true));
    expect(getPaneCollapse(getState(), "start")).toBe(true);
  });

  it("should toggle the collapsed state of frameworks in the callstack", () => {
    const { dispatch, getState } = createStore();
    const currentState = getFrameworkGroupingState(getState());
    dispatch(actions.toggleFrameworkGrouping(!currentState));
    expect(getFrameworkGroupingState(getState())).toBe(!currentState);
  });

  it("should highlight lines", () => {
    const { dispatch, getState } = createStore();
    const range = { start: 3, end: 5, sourceId: 2 };
    dispatch(actions.highlightLineRange(range));
    expect(getHighlightedLineRange(getState())).toEqual(range);
  });

  it("should clear highlight lines", () => {
    const { dispatch, getState } = createStore();
    const range = { start: 3, end: 5, sourceId: 2 };
    dispatch(actions.highlightLineRange(range));
    dispatch(actions.clearHighlightLineRange());
    expect(getHighlightedLineRange(getState())).toEqual({});
  });

  it("should set a directory as root directory", () => {
    const { dispatch, getState } = createStore();
    const projectRoot = getProjectDirectoryRoot(getState());
    dispatch(actions.setProjectDirectoryRoot(projectRoot));
    expect(getProjectDirectoryRoot(getState())).toBe(projectRoot);
  });
});
