/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

import mapOriginalExpression from "../mapOriginalExpression";

describe("mapOriginalExpression", () => {
  it("simple", () => {
    const expression = mapOriginalExpression("a + b;", {
      a: "foo",
      b: "bar"
    });
    expect(expression).toEqual("foo + bar;");
  });

  it("this", () => {
    const expression = mapOriginalExpression("this.prop;", {
      this: "_this"
    });
    expect(expression).toEqual("_this.prop;");
  });

  it("member expressions", () => {
    const expression = mapOriginalExpression("a + b", {
      a: "_mod.foo",
      b: "_mod.bar"
    });
    expect(expression).toEqual("_mod.foo + _mod.bar;");
  });

  it("block", () => {
    // todo: maybe wrap with parens ()
    const expression = mapOriginalExpression("{a}", {
      a: "_mod.foo",
      b: "_mod.bar"
    });
    expect(expression).toEqual("{\n  _mod.foo;\n}");
  });

  it("skips codegen with no mappings", () => {
    const expression = mapOriginalExpression("a + b", {
      a: "a",
      c: "_c"
    });
    expect(expression).toEqual("a + b");
  });

  it("shadowed bindings", () => {
    const expression = mapOriginalExpression(
      "window.thing = function fn(){ var a; a; b; }; a; b; ",
      {
        a: "_a",
        b: "_b"
      }
    );
    expect(expression).toEqual(
      "window.thing = function fn() {\n  var a;\n  a;\n  _b;\n};\n\n_a;\n_b;"
    );
  });

  it("variable declarator", () => {
    const expression = mapOriginalExpression("var a = 3", {});
    expect(expression.replace("\n", "")).toEqual(
      'if (!window.hasOwnProperty("a")) window.a = 3;'
    );
  });

  it("const variable declarator", () => {
    const expression = mapOriginalExpression("const a = 3", {});
    expect(expression.replace("\n", "")).toEqual(
      'if (!window.hasOwnProperty("a")) window.a = 3;'
    );
  });

  it("variable declaration", () => {
    const expression = mapOriginalExpression("var a = 3, b = 4", {});
    expect(expression.replace("\n", "")).toEqual(
      'if (!window.hasOwnProperty("a")) window.a = 3;if ' +
        '(!window.hasOwnProperty("b")) window.b = 4;'
    );
  });

  it("block scope variable declarators", () => {
    const expression = mapOriginalExpression("() => { var a = 3 }", {});
    expect(expression.replace(/\n/gm, "")).toEqual("() => { var a = 3 }");
  });

  it("lexical scope variable declarators", () => {
    const expression = mapOriginalExpression("if (true) { var a = 3 }", {});
    expect(expression.replace(/\n/gm, "")).toEqual("if (true) { var a = 3 }");
  });
});
