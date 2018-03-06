import { endTruncateStr } from "./utils";
import { getFilename } from "./source";
import { get, find, findIndex, flatMap, zip, range } from "lodash";

import type { Frame } from "../types";
import type { LocalFrame } from "../components/SecondaryPanes/Frames/types";

function getFrameUrl(frame) {
  return get(frame, "source.url", "") || "";
}

const libraryMap = [
  {
    label: "Backbone",
    pattern: /backbone/i
  },
  {
    label: "jQuery",
    pattern: /jquery/i
  },
  {
    label: "Preact",
    pattern: /preact/i
  },
  {
    label: "React",
    pattern: /react/i
  },
  {
    label: "Immutable",
    pattern: /immutable/i
  },
  {
    label: "Webpack",
    pattern: /webpack\/bootstrap/i
  },
  {
    label: "Node",
    pattern: /(^internal\/|^[^.\/]+\.js)/
  },
  {
    label: "Express",
    pattern: /node_modules\/express/
  },
  {
    label: "Pug",
    pattern: /node_modules\/pug/
  },
  {
    label: "ExtJS",
    pattern: /\/ext-all[\.\-]/
  },
  {
    label: "MobX",
    pattern: /mobx/i
  },
  {
    label: "Underscore",
    pattern: /underscore/i
  },
  {
    label: "Lodash",
    pattern: /lodash/i
  },
  {
    label: "Ember",
    pattern: /ember/i
  },
  {
    label: "Choo",
    pattern: /choo/i
  },
  {
    label: "VueJS",
    pattern: /vue\.js/i
  },
  {
    label: "RxJS",
    pattern: /rxjs/i
  },
  {
    label: "Angular",
    pattern: /angular/i
  },
  {
    label: "Redux",
    pattern: /redux/i
  },
  {
    label: "Dojo",
    pattern: /dojo/i
  },
  {
    label: "Marko",
    pattern: /marko/i
  },
  {
    label: "NuxtJS",
    pattern: /[\._]nuxt/i
  },
  {
    label: "Aframe",
    pattern: /aframe/i
  },
  {
    label: "NextJS",
    pattern: /[\._]next/i
  }
];

export function getLibraryFromUrl(frame: Frame) {
  // @TODO each of these fns calls getFrameUrl, just call it once
  // (assuming there's not more complex logic to identify a lib)
  const frameUrl = getFrameUrl(frame);
  const match = find(libraryMap, o => frameUrl.match(o.pattern));
  return match && match.label;
}
