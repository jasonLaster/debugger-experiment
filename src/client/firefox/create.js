// @flow
// This module converts Firefox specific types to the generic types

const get = require("lodash/get");
import type { Frame, Source } from "../types";
import type {
  PausedPacket,
  FramesResponse,
  FramePacket,
  SourcePayload
} from "./types";
import toPairs from "lodash/toPairs";

export function createFrame(frame: FramePacket): Frame {
  let title;
  if (frame.type == "call") {
    let c = frame.callee;
    title = c.name || c.userDisplayName || c.displayName || "(anonymous)";
  } else {
    title = `(${frame.type})`;
  }

  return {
    id: frame.actor,
    displayName: title,
    location: {
      sourceId: get(frame, "where.source.actor", null),
      line: frame.where.line,
      column: frame.where.column
    },
    this: frame.this,
    scope: frame.environment
  };
}

export function createSource(source: SourcePayload): Source {
  return {
    id: source.actor,
    url: source.url,
    isPrettyPrinted: false,
    sourceMapURL: source.sourceMapURL,
    isBlackBoxed: false
  };
}

export function createScope(scope: Scope, index) {
  return Object.assign({}, scope, {
    scopeId: `scope${index}`
  });
}

export function getScopes(scope: Scope) {
  const scopes = [];
  let index = 0;
  do {
    scopes.push(createScope(scope, index));
    index++;
  } while ((scope = scope.parent)); // eslint-disable-line no-cond-assign)
  return scopes;
}

export function getLoadedObjects(scope: Scope) {
  const bindings = scope.bindings;
  if (!bindings) {
    return [];
  }

  const args = bindings.arguments.map(arg => toPairs(arg)[0]);
  const variables = toPairs(bindings.variables);

  return args.concat(variables).map(([name, value]) =>
    Object.assign({}, value, {
      objectId: `${scope.scopeId}/${name}`
    })
  );
}

export function getFrameLoadedObjects(frame: Frame) {
  return getScopes(frame.scope).map(getLoadedObjects);
}

export function createPause(
  packet: PausedPacket,
  response: FramesResponse
): any {
  // NOTE: useful when the debugger is already paused
  const frame = packet.frame || response.frames[0];

  return Object.assign({}, packet, {
    frame: createFrame(frame),
    frames: response.frames.map(createFrame),
    getLoadedObjects: response.frames.map(getFramesLoadedObjects)
  });
}
