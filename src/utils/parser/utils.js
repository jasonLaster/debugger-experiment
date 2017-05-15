// @flow

const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const t = require("babel-types");
const { isDevelopment } = require("devtools-config");
const toPairs = require("lodash/toPairs");
const isEmpty = require("lodash/isEmpty");
const uniq = require("lodash/uniq");
import getAst, { traverseAst } from "./getAst";
import { isFunction, isVariable } from "./shared";
import type { SourceText, Location, Frame, TokenResolution } from "../../types";

function getNodeValue(node) {
  if (t.isThisExpression(node)) {
    return "this";
  }

  return node.name;
}

function getScopeVariables(scope: Scope) {
  const { bindings } = scope;

  return toPairs(bindings).map(([name, binding]) => ({
    name,
    references: binding.referencePaths
  }));
}

function getScopeChain(scope: Scope): Scope[] {
  const scopes = [scope];

  do {
    scopes.push(scope);
  } while ((scope = scope.parent));

  return scopes;
}

function isLexicalScope(path) {
  return isFunction(path) || t.isProgram(path);
}

// Resolves a token (at location) in the source to determine if it is in scope
// of the given frame and the expression (if any) to which it belongs
export function resolveToken(
  source: SourceText,
  token: string,
  location: Location,
  frame: Frame
): ?TokenResolution {
  const expression = getClosestExpression(source, token, location);
  const scope = getClosestScope(source, location);

  if (!expression || !expression.value || !scope) {
    return { expression: null, inScope: false };
  }

  const inScope = isExpressionInScope(expression.value, scope);

  return {
    expression,
    inScope
  };
}

export function getVariablesInLocalScope(scope: Scope) {
  return getScopeVariables(scope);
}

export function getVariablesInScope(scope: Scope) {
  const scopes = getScopeChain(scope);
  const scopeVars = scopes.map(getScopeVariables);
  const vars = [{ name: "this" }, { name: "arguments" }]
    .concat(...scopeVars)
    .map(variable => variable.name);
  return uniq(vars);
}

export function isExpressionInScope(expression: string, scope?: Scope) {
  if (!scope) {
    return false;
  }

  const variables = getVariablesInScope(scope);
  const firstPart = expression.split(/\./)[0];
  return variables.includes(firstPart);
}
