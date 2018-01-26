import { getASTLocation } from "../astBreakpointLocation.js";
import { getSource } from "../../../workers/parser/tests/helpers";
import { setSource } from "../../../workers/parser/index";

describe("ast", () => {
  describe("valid location", () => {
    it("returns the scope and offset", async () => {
      const source = getSource("math");
      setSource(source);
      const location = { line: 6, column: 0 };
      const astLocation = await getASTLocation(source, location);
      expect(astLocation.name).toBe("math");
      expect(astLocation).toMatchSnapshot();
    });

    it("returns name for a nested anon fn as the parent func", async () => {
      const source = getSource("outOfScope");
      setSource(source);
      const location = { line: 25, column: 0 };
      const astLocation = await getASTLocation(source, location);
      expect(astLocation.name).toBe("outer");
      expect(astLocation).toMatchSnapshot();
    });

    it("returns name for a nested named fn", async () => {
      const source = getSource("outOfScope");
      setSource(source);
      const location = { line: 5, column: 0 };
      const astLocation = await getASTLocation(source, location);
      expect(astLocation.name).toBe("inner");
      expect(astLocation).toMatchSnapshot();
    });

    it("returns name for an anon fn with a named variable", async () => {
      const source = getSource("outOfScope");
      setSource(source);
      const location = { line: 40, column: 0 };
      const astLocation = await getASTLocation(source, location);
      expect(astLocation.name).toBe("globalDeclaration");
      expect(astLocation).toMatchSnapshot();
    });
  });

  describe("invalid location", () => {
    it("returns the scope name for global scope as undefined", async () => {
      const source = getSource("class");
      setSource(source);
      const location = { line: 10, column: 0 };
      const astLocation = await getASTLocation(source, location);
      expect(astLocation.name).toBe(undefined);
      expect(astLocation).toMatchSnapshot();
    });

    it("returns name for an anon fn in global scope as undefined", async () => {
      const source = getSource("outOfScope");
      setSource(source);
      const location = { line: 44, column: 0 };
      const astLocation = await getASTLocation(source, location);
      expect(astLocation.name).toBe(undefined);
      expect(astLocation).toMatchSnapshot();
    });
  });
});
