// @flow

import { parseExpression } from "./utils/ast";

export function hasSyntaxError(input: string) {
  try {
    parseExpression(input, { sourceType: "script" });
    return false;
  } catch (e) {
    return `${e.name} : ${input} is an invalid.`;
  }
}
