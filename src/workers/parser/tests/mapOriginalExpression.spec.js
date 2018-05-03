/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

import mapOriginalExpression from "../mapOriginalExpression";

describe("mapOriginalExpression", () => {
  it("simple", () => {
    const generatedExpression = mapOriginalExpression("a + b;", {
      a: "foo",
      b: "bar"
    });
    expect(generatedExpression).toEqual("foo + bar;");
  });

  it("this", () => {
    const generatedExpression = mapOriginalExpression("this.prop;", {
      this: "_this"
    });
    expect(generatedExpression).toEqual("_this.prop;");
  });

  it("member expressions", () => {
    const generatedExpression = mapOriginalExpression("a + b", {
      a: "_mod.foo",
      b: "_mod.bar"
    });
    expect(generatedExpression).toEqual("_mod.foo + _mod.bar;");
  });

  it("block", () => {
    // todo: maybe wrap with parens ()
    const generatedExpression = mapOriginalExpression("{a}", {
      a: "_mod.foo",
      b: "_mod.bar"
    });
    expect(generatedExpression).toEqual("{\n  _mod.foo;\n}");
  });

  it("skips codegen with no mappings", () => {
    const generatedExpression = mapOriginalExpression("a + b", {
      a: "a",
      c: "_c"
    });
    expect(generatedExpression).toEqual("a + b");
  });

  it("shadowed bindings", () => {
    const generatedExpression = mapOriginalExpression(
      "window.thing = function fn(){ var a; a; b; }; a; b; ",
      {
        a: "_a",
        b: "_b"
      }
    );
    expect(generatedExpression).toEqual(
      "window.thing = function fn() {\n  var a;\n  a;\n  _b;\n};\n\n_a;\n_b;"
    );
  });

  it("variable declarator", () => {
    const generatedExpression = mapOriginalExpression("var a = 3",{})
    expect(generatedExpression.replace("\n", ""))
      .toEqual('if (!window.hasOwnProperty("a")) window.a = 3;');
  });

  it("const variable declarator", () => {
    const generatedExpression = mapOriginalExpression("const a = 3",{})
    expect(generatedExpression.replace("\n", ""))
      .toEqual('if (!window.hasOwnProperty("a")) window.a = 3;');
  });

  it("variable declaration", () => {
    const generatedExpression = mapOriginalExpression("var a = 3, b = 4",{})
    expect(generatedExpression.replace("\n", ""))
      .toEqual('if (!window.hasOwnProperty("a")) window.a = 3;if ' +
          '(!window.hasOwnProperty("b")) window.b = 4;');
  });

  it("block scope variable declarators", () => {
    const generatedExpression = mapOriginalExpression("() => { var a = 3 }",{})
    expect(generatedExpression.replace(/\n/mg, ""))
      .toEqual('() => { var a = 3 }');
  });
});
