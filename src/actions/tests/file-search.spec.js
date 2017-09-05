import { createStore, selectors, actions } from "../../utils/test-head";

const {
  getActiveSearch,
  getFileSearchQuery,
  getFileSearchModifiers,
  getSearchResults
} = selectors;

describe("File Search", () => {
  it("should toggle the visible state of file search", () => {
    const { dispatch, getState } = createStore();
    expect(getActiveSearch(getState())).toBe(null);
    dispatch(actions.setActiveSearch("file"));
    expect(getActiveSearch(getState())).toBe("file");
  });

  fit("should update search results", () => {
    const { dispatch, getState } = createStore();
    expect(getSearchResults(getState())).toEqual({
      matches: [],
      matchIndex: -1,
      index: -1,
      count: 0
    });

    const results = { count: 3, index: 2 };
    dispatch(actions.updateSearchResults(results));
    //   expect(getSearchResults(getState())).toEqual(results);
  });

  it("should close file search", () => {
    const { dispatch, getState } = createStore();
    expect(getActiveSearch(getState())).toBe(null);
    dispatch(actions.setActiveSearch("file"));
    dispatch(actions.closeActiveSearch());
    expect(getActiveSearch(getState())).toBe(null);
  });

  it("should update the file search query", () => {
    const { dispatch, getState } = createStore();
    let fileSearchQueryState = getFileSearchQuery(getState());
    expect(fileSearchQueryState).toBe("");
    dispatch(actions.setFileSearchQuery("foobar"));
    fileSearchQueryState = getFileSearchQuery(getState());
    expect(fileSearchQueryState).toBe("foobar");
  });

  it("should toggle a file search modifier", () => {
    const { dispatch, getState } = createStore();
    let fileSearchModState = getFileSearchModifiers(getState());
    expect(fileSearchModState.get("caseSensitive")).toBe(false);
    dispatch(actions.toggleFileSearchModifier("caseSensitive"));
    fileSearchModState = getFileSearchModifiers(getState());
    expect(fileSearchModState.get("caseSensitive")).toBe(true);
  });
});
