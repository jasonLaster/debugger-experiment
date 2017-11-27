import {
  createStore,
  selectors,
  actions,
  makeSource
} from "../../utils/test-head";

import {
  simulateCorrectThreadClient,
  simpleMockThreadClient
} from "./helpers/threadClient.js";

describe("breakpoints", () => {
  it("should add a breakpoint", async () => {
    const { dispatch, getState } = createStore(simpleMockThreadClient);
    const loc1 = {
      sourceId: "a",
      line: 5,
      sourceUrl: "http://localhost:8000/examples/a"
    };
    await dispatch(actions.newSource(makeSource("a")));
    await dispatch(actions.addBreakpoint(loc1));

    const bps = selectors.getBreakpoints(getState());
    const bp = selectors.getBreakpoint(getState(), loc1);
    expect(bps.size).toBe(1);
    expect(bp.location).toEqual(loc1);
  });

  it("should not re-add a breakpoint", async () => {
    const { dispatch, getState } = createStore(simpleMockThreadClient);
    const loc1 = {
      sourceId: "a",
      line: 5,
      sourceUrl: "http://localhost:8000/examples/a"
    };

    await dispatch(actions.newSource(makeSource("a")));
    await dispatch(actions.addBreakpoint(loc1));
    let bps = selectors.getBreakpoints(getState());
    const bp = selectors.getBreakpoint(getState(), loc1);
    expect(bps.size).toBe(1);
    expect(bp.location).toEqual(loc1);

    await dispatch(actions.addBreakpoint(loc1));
    bps = selectors.getBreakpoints(getState());
    expect(bps.size).toBe(1);
  });

  describe("adding a breakpoint to an invalid location", async () => {
    it("adds only one breakpoint with a corrected location", async () => {
      const invalidLocation = {
        sourceId: "a",
        line: 5,
        sourceUrl: "http://localhost:8000/examples/a"
      };
      const {
        correctedThreadClient,
        correctedLocation
      } = simulateCorrectThreadClient(2, invalidLocation);
      const { dispatch, getState } = createStore(correctedThreadClient);

      await dispatch(actions.newSource(makeSource("a")));
      await dispatch(actions.addBreakpoint(invalidLocation));
      const state = getState();
      const bps = selectors.getBreakpoints(state);
      const bp = selectors.getBreakpoint(state, correctedLocation);
      expect(bps.size).toBe(1);
      expect(bp.location).toEqual(correctedLocation);
    });
  });

  it("should remove a breakpoint", async () => {
    const { dispatch, getState } = createStore(simpleMockThreadClient);

    const loc1 = {
      sourceId: "a",
      line: 5,
      sourceUrl: "http://localhost:8000/examples/a"
    };

    const loc2 = {
      sourceId: "b",
      line: 6,
      sourceUrl: "http://localhost:8000/examples/b"
    };

    await dispatch(actions.newSource(makeSource("a")));
    await dispatch(actions.newSource(makeSource("b")));
    await dispatch(actions.addBreakpoint(loc1));
    await dispatch(actions.addBreakpoint(loc2));

    await dispatch(actions.removeBreakpoint(loc1));

    expect(selectors.getBreakpoints(getState()).size).toBe(1);
  });

  it("should disable a breakpoint", async () => {
    const { dispatch, getState } = createStore(simpleMockThreadClient);

    const loc1 = {
      sourceId: "a",
      line: 5,
      sourceUrl: "http://localhost:8000/examples/a"
    };

    const loc2 = {
      sourceId: "b",
      line: 6,
      sourceUrl: "http://localhost:8000/examples/b"
    };

    await dispatch(actions.newSource(makeSource("a")));
    await dispatch(actions.newSource(makeSource("b")));

    await dispatch(actions.addBreakpoint(loc1));
    await dispatch(actions.addBreakpoint(loc2));

    await dispatch(actions.disableBreakpoint(loc1));

    expect(selectors.getBreakpoint(getState(), loc1).disabled).toBe(true);
  });

  it("should enable breakpoint", async () => {
    const { dispatch, getState } = createStore(simpleMockThreadClient);
    const loc = {
      sourceId: "a",
      line: 5,
      sourceUrl: "http://localhost:8000/examples/a"
    };

    await dispatch(actions.newSource(makeSource("a")));
    await dispatch(actions.addBreakpoint(loc));
    await dispatch(actions.disableBreakpoint(loc));

    expect(selectors.getBreakpoint(getState(), loc).disabled).toBe(true);

    await dispatch(actions.enableBreakpoint(loc));

    expect(selectors.getBreakpoint(getState(), loc).disabled).toBe(false);
  });

  it("should set the breakpoint condition", async () => {
    const { dispatch, getState } = createStore(simpleMockThreadClient);

    const loc = {
      sourceId: "a",
      line: 5,
      sourceUrl: "http://localhost:8000/examples/a"
    };

    await dispatch(actions.newSource(makeSource("a")));
    await dispatch(actions.addBreakpoint(loc));

    expect(selectors.getBreakpoint(getState(), loc).condition).toBe(null);

    await dispatch(
      actions.setBreakpointCondition(loc, {
        condition: "const foo = 0",
        getTextForLine: () => {}
      })
    );

    expect(selectors.getBreakpoint(getState(), loc).condition).toBe(
      "const foo = 0"
    );
  });

  it("should set the condition and enable a breakpoint", async () => {
    const { dispatch, getState } = createStore(simpleMockThreadClient);

    const loc = {
      sourceId: "a",
      line: 5,
      sourceUrl: "http://localhost:8000/examples/a"
    };

    await dispatch(actions.newSource(makeSource("a")));
    await dispatch(actions.addBreakpoint(loc));
    await dispatch(actions.disableBreakpoint(loc));

    expect(selectors.getBreakpoint(getState(), loc).condition).toBe(null);

    await dispatch(
      actions.setBreakpointCondition(loc, {
        condition: "const foo = 0",
        getTextForLine: () => {}
      })
    );
    const breakpoint = selectors.getBreakpoint(getState(), loc);
    expect(breakpoint.disabled).toBe(false);
    expect(breakpoint.condition).toBe("const foo = 0");
  });

  it("should remap breakpoints on pretty print", async () => {
    const { dispatch, getState } = createStore(simpleMockThreadClient);

    const loc = {
      sourceId: "a.js",
      line: 1,
      sourceUrl: "http://localhost:8000/examples/a.js"
    };

    const url = "a.js";
    const source = makeSource(url);
    source.text = "function(a,b,c){return {a,b,c}}";

    await dispatch(actions.newSource(source));
    await dispatch(actions.addBreakpoint(loc));
    await dispatch(actions.togglePrettyPrint(source.id));

    const breakpoint = selectors.getBreakpoints(getState()).first();

    expect(breakpoint.location.sourceUrl.includes("formatted")).toBe(true);
    expect(breakpoint).toMatchSnapshot();
  });
});
