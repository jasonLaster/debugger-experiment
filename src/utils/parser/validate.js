// @flow

import * as babylon from "babylon";

export function validateSyntax(input: string) {
  try {
    babylon.parseExpression(input);
    return input;
  } catch (e) {
    return `${e.name} : ${input} is an invalid.`;
  }
}
