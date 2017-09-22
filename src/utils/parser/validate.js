// @flow

import { parseExpression } from "./utils/ast";

export function validateSyntax(input: string) {
  try {
    parseExpression(input, { sourceType: "script" });
    return input;
  } catch (e) {
    return `${e.name} : ${input} is an invalid.`;
  }
}
