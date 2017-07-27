import React, { DOM as dom } from "react";
import { storiesOf } from "@kadira/storybook";

import { L10N } from "devtools-launchpad";

import "../App.css";
import "devtools-launchpad/src/lib/themes/dark-theme.css";

// NOTE: we need this for supporting L10N in storybook
// we can move this to a shared helper as we add additional stories
if (typeof window == "object") {
  window.L10N = L10N;
  window.L10N.setBundle(require("../../../assets/panel/debugger.properties"));
}

storiesOf("Utils", module).add("vertical center", () => {
  return dom.div(
    {
      style: { height: "300px", background: "blue", position: "relative" }
    },
    dom.div(
      {
        className: "vertical-center",
        style: { margin: "0 auto", height: 20, width: 30, color: "white" }
      },
      "Hello"
    )
  );
});
