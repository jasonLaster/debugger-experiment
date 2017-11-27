function toggleDisabledBreakpoint(line: number, column?: number) {
  return ({ dispatch, getState, client, sourceMaps }: ThunkArgs) => {
    const bp = getBreakpointAtLocation(getState(), { line, column });
    if (!bp || bp.loading) {
      return;
    }

    if (!bp.disabled) {
      return dispatch(disableBreakpoint(bp.location));
    }
    return dispatch(enableBreakpoint(bp.location));
  };
}

export function toggleBreakpoint(line: number, column?: number) {
  return ({ dispatch, getState, client, sourceMaps }: ThunkArgs) => {
    const state = getState();
    const selectedSource = getSelectedSource(state);
    const bp = getBreakpointAtLocation(state, { line, column });
    const isEmptyLine = isEmptyLineInSource(state, line, selectedSource.toJS());

    if ((!bp && isEmptyLine) || (bp && bp.loading)) {
      return;
    }

    if (bp) {
      if (bp.disabled) {
        // NOTE: it's possible the breakpoint has slid to a column
        return dispatch(
          toggleDisabledBreakpoint(line, column || bp.location.column)
        );
      }

      // NOTE: it's possible the breakpoint has slid to a column
      return dispatch(
        removeBreakpoint({
          sourceId: bp.location.sourceId,
          sourceUrl: bp.location.sourceUrl,
          line: bp.location.line,
          column: column || bp.location.column
        })
      );
    }

    return dispatch(
      addBreakpoint({
        sourceId: selectedSource.get("id"),
        sourceUrl: selectedSource.get("url"),
        line: line,
        column: column
      })
    );
  };
}
