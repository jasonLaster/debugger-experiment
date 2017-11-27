describe("breakpoints - toggle breakpoint", () => {
  // we should actually have a source w/ a fixture
  // that we can load w/ loadSourceText and then use
  // realistically...
  // see the action/sources tests

  it("should toggle all the breakpoints", async () => {
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

    await dispatch(actions.toggleAllBreakpoints(true));

    expect(selectors.getBreakpoint(getState(), loc1).disabled).toBe(true);
    expect(selectors.getBreakpoint(getState(), loc2).disabled).toBe(true);

    await dispatch(actions.toggleAllBreakpoints());

    expect(selectors.getBreakpoint(getState(), loc1).disabled).toBe(false);
    expect(selectors.getBreakpoint(getState(), loc2).disabled).toBe(false);
  });

  it("should toggle a breakpoint at a location", async () => {
    const { dispatch, getState } = createStore(simpleMockThreadClient);

    await dispatch(actions.newSource(makeSource("foo1")));
    await dispatch(actions.selectSource("foo1", { line: 1 }));

    await dispatch(actions.toggleBreakpoint(5));
    await dispatch(actions.toggleBreakpoint(6, 1));
    expect(
      selectors.getBreakpoint(getState(), { sourceId: "foo1", line: 5 })
        .disabled
    ).toBe(false);

    expect(
      selectors.getBreakpoint(getState(), {
        sourceId: "foo1",
        line: 6,
        column: 1
      }).disabled
    ).toBe(false);

    await dispatch(actions.toggleBreakpoint(5));
    await dispatch(actions.toggleBreakpoint(6, 1));

    expect(
      selectors.getBreakpoint(getState(), { sourceId: "foo1", line: 5 })
    ).toBe(undefined);

    expect(
      selectors.getBreakpoint(getState(), {
        sourceId: "foo1",
        line: 6,
        column: 1
      })
    ).toBe(undefined);
  });

  it("should disable/enable a breakpoint at a location", async () => {
    const { dispatch, getState } = createStore(simpleMockThreadClient);

    await dispatch(actions.newSource(makeSource("foo1")));
    await dispatch(actions.selectSource("foo1", { line: 1 }));

    await dispatch(actions.toggleBreakpoint(5));
    await dispatch(actions.toggleBreakpoint(6, 1));
    expect(
      selectors.getBreakpoint(getState(), { sourceId: "foo1", line: 5 })
        .disabled
    ).toBe(false);

    expect(
      selectors.getBreakpoint(getState(), {
        sourceId: "foo1",
        line: 6,
        column: 1
      }).disabled
    ).toBe(false);

    await dispatch(actions.toggleDisabledBreakpoint(5));
    await dispatch(actions.toggleDisabledBreakpoint(6, 1));

    expect(
      selectors.getBreakpoint(getState(), { sourceId: "foo1", line: 5 })
        .disabled
    ).toBe(true);

    expect(
      selectors.getBreakpoint(getState(), {
        sourceId: "foo1",
        line: 6,
        column: 1
      }).disabled
    ).toBe(true);
  });
});
