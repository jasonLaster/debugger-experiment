/* eslint max-nested-callbacks: ["error", 4]*/

import { getClosestScope, getClosestExpression } from "../utils/closest";

import { setSource } from "../sources";
import { getSource } from "./helpers";

describe("parser", () => {
  describe("getClosestExpression", () => {
    describe("member expressions", () => {
      it("Can find a member expression", () => {
        const source = getSource("resolveToken");
        setSource(source);
        const expression = getClosestExpression("resolveToken", "x", {
          line: 15,
          column: 31
        });

        expect(expression).toMatchSnapshot();
      });

      it("find a nested expression", () => {
        const source = getSource("expression");
        setSource(source);
        const expression = getClosestExpression(
          "expression",
          "secondProperty",
          {
            line: 2,
            column: 22
          }
        );

        expect(expression).toMatchSnapshot();
      });

      it("finds an expression with a call", () => {
        const source = getSource("expression");
        setSource(source);
        const expression = getClosestExpression(
          "expression",
          "secondProperty",
          {
            line: 6,
            column: 32
          }
        );

        expect(expression).toMatchSnapshot();
      });
    });

    it("Can find a local var", () => {
      const source = getSource("resolveToken");
      setSource(source);
      const expression = getClosestExpression("resolveToken", "beta", {
        line: 15,
        column: 21
      });

      expect(expression).toMatchSnapshot();
    });
  });

  describe("getClosestScope", () => {
    it("finds the scope at the beginning", () => {
      const source = getSource("func");
      setSource(source);
      const scope = getClosestScope("func", {
        line: 5,
        column: 8
      });

      const node = scope.block;
      expect(node).toMatchSnapshot();
    });

    it("finds a scope given at the end", () => {
      const source = getSource("func");
      setSource(source);
      const scope = getClosestScope("func", {
        line: 9,
        column: 1
      });

      const node = scope.block;
      expect(node).toMatchSnapshot();
    });

    it("Can find the function declaration for square", () => {
      const source = getSource("func");
      setSource(source);
      const scope = getClosestScope("func", {
        line: 1,
        column: 1
      });

      const node = scope.block;
      expect(node).toMatchSnapshot();
    });
  });
});
