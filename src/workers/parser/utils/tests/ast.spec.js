/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

import { getAst, findNode, hasNode } from "../ast";
import { setSource } from "../../sources";
import cases from "jest-in-case";
import * as t from "@babel/types";
import * as babylon from "babylon";

function createSource(contentType) {
  return { id: "foo", text: "2", contentType };
}

const astKeys = [
  "type",
  "start",
  "end",
  "loc",
  "program",
  "comments",
  "tokens"
];

cases(
  "ast.getAst",
  ({ name }) => {
    const source = createSource(name);
    setSource(source);
    expect(Object.keys(getAst("foo"))).toEqual(astKeys);
  },
  [
    { name: "text/javascript" },
    { name: "application/javascript" },
    { name: "application/x-javascript" },
    { name: "text/jsx" }
  ]
);

describe("hasNode", () => {
  it("matches a node", () => {
    const ast = babylon.parse(`const a = [3,4];`);
    expect(hasNode(ast, node => t.isVariableDeclarator(node))).toEqual(true);
  });

  it("when it does not matche a node", () => {
    const ast = babylon.parse(`const a = [3,4];`);
    expect(hasNode(ast, node => t.isFunctionDeclaration(node))).toEqual(false);
  });
});

describe("findNode", () => {
  it("finds a node", () => {
    const ast = babylon.parse(`const a = [3,4];`);
    const dec = ast.program.body[0];
    expect(findNode(ast, node => t.isVariableDeclaration(node))).toEqual(dec);
  });

  it("when there is no node", () => {
    const ast = babylon.parse(`const a = [3,4];`);
    expect(findNode(ast, node => t.isFunctionDeclaration(node))).toEqual(null);
  });
});
