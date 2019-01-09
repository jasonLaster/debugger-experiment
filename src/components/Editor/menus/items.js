/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

export const continueToHereItem = ({ actions: { continueToHere } }) => ({
  accesskey: L10N.getStr("editor.continueToHere.accesskey"),
  disabled: false,
  click: () => continueToHere(line, column),
  id: "node-menu-continue-to-here",
  label: L10N.getStr("editor.continueToHere.label")
});

export const toggleBreakpointItem = ({
  actions: { toggleBreakpoint },
  breakpoint,
  location: { line, column }
}) => ({
  accesskey: L10N.getStr("shortcuts.toggleBreakpoint.accesskey"),
  disabled: false,
  click: () => toggleBreakpoint(line, column),
  accelerator: L10N.getStr("toggleBreakpoint.key"),
  ...(breakpoint
    ? {
        id: "node-menu-remove-breakpoint",
        label: L10N.getStr("editor.removeBreakpoint")
      }
    : {
        id: "node-menu-add-breakpoint",
        label: L10N.getStr("editor.addBreakpoint")
      })
});

export const conditionalBreakpointItem = ({
  actions: { openConditionalPanel },
  breakpoint,
  location
}) => ({
  accesskey: L10N.getStr("editor.addConditionBreakpoint.accesskey"),
  disabled: false,
  // Leaving column undefined so pause points can be detected
  click: () =>
    openConditionalPanel(breakpoint ? breakpoint.location : location),
  accelerator: L10N.getStr("toggleCondPanel.key"),
  ...(breakpoint && breakpoint.condition
    ? {
        id: "node-menu-edit-conditional-breakpoint",
        label: L10N.getStr("editor.editConditionBreakpoint")
      }
    : {
        id: "node-menu-add-conditional-breakpoint",
        label: L10N.getStr("editor.addConditionBreakpoint")
      })
});

export const logPointItem = ({
  actions: { openConditionalPanel },
  breakpoint,
  location
}) => ({
  accesskey: L10N.getStr("editor.addLogPoint.accesskey"),
  disabled: false,
  click: () =>
    openConditionalPanel(breakpoint ? breakpoint.location : location, true),
  accelerator: L10N.getStr("toggleCondPanel.key"),
  ...(breakpoint && breakpoint.condition
    ? {
        id: "node-menu-edit-log-point",
        label: L10N.getStr("editor.editLogPoint")
      }
    : {
        id: "node-menu-add-log-point",
        label: L10N.getStr("editor.addLogPoint")
      })
});

export const toggleDisabledBreakpointItem = ({
  actions: { toggleDisabledBreakpoint },
  breakpoint,
  location: { line, column }
}) => {
  if (!breakpoint) {
    return null;
  }

  return {
    accesskey: L10N.getStr("editor.disableBreakpoint.accesskey"),
    disabled: false,
    click: () => toggleDisabledBreakpoint(line, column),
    ...(breakpoint.disabled
      ? {
          id: "node-menu-enable-breakpoint",
          label: L10N.getStr("editor.enableBreakpoint")
        }
      : {
          id: "node-menu-disable-breakpoint",
          label: L10N.getStr("editor.disableBreakpoint")
        })
  };
};

export function breakpointItems({ breakpoint, location, actions }) {
  return [
    conditionalBreakpointItem({ breakpoint, location, actions }),
    logPointItem({ breakpoint, location, actions }),
    toggleBreakpointItem({ breakpoint, location, actions }),
    toggleDisabledBreakpointItem({ breakpoint, location, actions })
  ].filter(i => i);
}
