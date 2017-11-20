import {
  actions,
  selectors,
  createStore,
  makeSource
} from "../../../utils/test-head";
const { getSource } = selectors;

describe("loadSourceText", () => {
  it("makes one request", async () => {
    let resolve;
    let count = 0;
    const { dispatch, getState } = createStore({
      sourceContents: () =>
        new Promise(r => {
          count++;
          resolve = r;
        })
    });
    let source = makeSource("foo", { loadedState: "unloaded" });

    await dispatch(actions.newSource(source));

    source = getSource(getState(), source.id).toJS();
    dispatch(actions.loadSourceText(source));

    // is currently loading
    // wait on the second load source call as that is the one that
    // is likely to observing the wrong promise
    source = getSource(getState(), source.id).toJS();
    const loading = dispatch(actions.loadSourceText(source));

    resolve({ source: "yay", contentType: "text/javascript" });
    await loading;

    // is loaded
    source = getSource(getState(), source.id).toJS();
    dispatch(actions.loadSourceText(source));

    expect(count).toEqual(1);
    source = getSource(getState(), source.id).toJS();
    expect(source.text).toEqual("yay");
  });
});
