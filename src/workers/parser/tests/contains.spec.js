import {
  containsPosition,
  containsLocation,
  nodeContainsPosition
} from "../utils/contains";

function getTestLoc() {
  return {
    start: {
      line: 10,
      column: 2
    },
    end: {
      line: 12,
      column: 10
    }
  };
}

describe("containsPosition", () => {
  describe("location and postion both with the column criteria", () => {
    it("should contain position within the location range", () => {
      const loc = getTestLoc();
      const pos = {
        line: loc.start.line + 1,
        column: loc.start.column + 1
      };
      expect(containsPosition(loc, pos)).toEqual(true);
    });

    it("should not contain position out of the start line", () => {
      const loc = getTestLoc();
      const pos = {
        line: loc.start.line - 1,
        column: loc.start.column
      };
      expect(containsPosition(loc, pos)).toEqual(false);
    });

    it("should not contain position out of the start column", () => {
      const loc = getTestLoc();
      const pos = {
        line: loc.start.line,
        column: loc.start.column - 1
      };
      expect(containsPosition(loc, pos)).toEqual(false);
    });

    it("should not contain position out of the end line", () => {
      const loc = getTestLoc();
      const pos = {
        line: loc.end.line + 1,
        column: loc.end.column
      };
      expect(containsPosition(loc, pos)).toEqual(false);
    });

    it("should not contain position out of the end column", () => {
      const loc = getTestLoc();
      const pos = {
        line: loc.end.line,
        column: loc.end.column + 1
      };
      expect(containsPosition(loc, pos)).toEqual(false);
    });

    it(`should contain position on the same start line and
        within the start column`, () => {
      const loc = getTestLoc();
      const pos = {
        line: loc.start.line,
        column: loc.start.column + 1
      };
      expect(containsPosition(loc, pos)).toEqual(true);
    });

    it(`should contain position on the same end line and
        within the end column`, () => {
      const loc = getTestLoc();
      const pos = {
        line: loc.end.line,
        column: loc.end.column - 1
      };
      expect(containsPosition(loc, pos)).toEqual(true);
    });
  });

  describe("position without the column criterion", () => {
    it("should contain position on the same start line", () => {
      const loc = getTestLoc();
      const pos = {
        line: loc.start.line
      };
      expect(containsPosition(loc, pos)).toEqual(true);
    });

    it("should contain position on the same end line", () => {
      const loc = getTestLoc();
      const pos = {
        line: loc.end.line
      };
      expect(containsPosition(loc, pos)).toEqual(true);
    });
  });

  describe("location without the column criterion", () => {
    it("should contain position on the same start line", () => {
      const loc = getTestLoc();
      loc.start.column = undefined;
      const pos = {
        line: loc.start.line,
        column: 1
      };
      expect(containsPosition(loc, pos)).toEqual(true);
    });

    it("should contain position on the same end line", () => {
      const loc = getTestLoc();
      loc.end.column = undefined;
      const pos = {
        line: loc.end.line,
        column: 1
      };
      expect(containsPosition(loc, pos)).toEqual(true);
    });
  });

  describe("location and postion both without the column criterion", () => {
    it("should contain position on the same start line", () => {
      const loc = getTestLoc();
      loc.start.column = undefined;
      const pos = {
        line: loc.start.line
      };
      expect(containsPosition(loc, pos)).toEqual(true);
    });

    it("should contain position on the same end line", () => {
      const loc = getTestLoc();
      loc.end.column = undefined;
      const pos = {
        line: loc.end.line
      };
      expect(containsPosition(loc, pos)).toEqual(true);
    });
  });
});

describe("containsLocation", () => {
  describe("locations both with the column criteria", () => {
    it("should contian location within the range", () => {
      const locA = getTestLoc();
      const locB = {
        start: {
          line: locA.start.line + 1,
          column: locA.start.column + 1
        },
        end: {
          line: locA.end.line - 1,
          column: locA.end.column - 1
        }
      };
      expect(containsLocation(locA, locB)).toEqual(true);
    });

    it("should not contian location out of the start line", () => {
      const locA = getTestLoc();
      const locB = getTestLoc();
      locB.start.line--;
      expect(containsLocation(locA, locB)).toEqual(false);
    });

    it("should not contian location out of the start column", () => {
      const locA = getTestLoc();
      const locB = getTestLoc();
      locB.start.column--;
      expect(containsLocation(locA, locB)).toEqual(false);
    });

    it("should not contian location out of the end line", () => {
      const locA = getTestLoc();
      const locB = getTestLoc();
      locB.end.line++;
      expect(containsLocation(locA, locB)).toEqual(false);
    });

    it("should not contian location out of the end column", () => {
      const locA = getTestLoc();
      const locB = getTestLoc();
      locB.end.column++;
      expect(containsLocation(locA, locB)).toEqual(false);
    });

    it(`should contain location on the same start line and 
        within the start column`, () => {
      const locA = getTestLoc();
      const locB = {
        start: {
          line: locA.start.line,
          column: locA.start.column + 1
        },
        end: {
          line: locA.end.line - 1,
          column: locA.end.column - 1
        }
      };
      expect(containsLocation(locA, locB)).toEqual(true);
    });

    it(`should contain location on the same end line and 
        within the end column`, () => {
      const locA = getTestLoc();
      const locB = {
        start: {
          line: locA.start.line + 1,
          column: locA.start.column + 1
        },
        end: {
          line: locA.end.line,
          column: locA.end.column - 1
        }
      };
      expect(containsLocation(locA, locB)).toEqual(true);
    });
  });

  describe("location A without the column criterion", () => {
    it("should contain location on the same start line", () => {
      const locA = getTestLoc();
      locA.start.column = undefined;
      const locB = getTestLoc();
      expect(containsLocation(locA, locB)).toEqual(true);
    });

    it("should contain location on the same end line", () => {
      const locA = getTestLoc();
      locA.end.column = undefined;
      const locB = getTestLoc();
      expect(containsLocation(locA, locB)).toEqual(true);
    });
  });

  describe("location B without the column criterion", () => {
    it("should contain location on the same start line", () => {
      const locA = getTestLoc();
      const locB = getTestLoc();
      locB.start.column = undefined;
      expect(containsLocation(locA, locB)).toEqual(true);
    });

    it("should contain location on the same end line", () => {
      const locA = getTestLoc();
      const locB = getTestLoc();
      locB.end.column = undefined;
      expect(containsLocation(locA, locB)).toEqual(true);
    });
  });

  describe("locations both without the column criteria", () => {
    it("should contain location on the same start line", () => {
      const locA = getTestLoc();
      const locB = getTestLoc();
      locA.start.column = undefined;
      locB.start.column = undefined;
      expect(containsLocation(locA, locB)).toEqual(true);
    });

    it("should contain location on the same end line", () => {
      const locA = getTestLoc();
      const locB = getTestLoc();
      locA.end.column = undefined;
      locB.end.column = undefined;
      expect(containsLocation(locA, locB)).toEqual(true);
    });
  });
});

describe("nodeContainsPosition", () => {
  describe("node and position both with the column criteria", () => {
    it("should contian position within the range", () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.start.line + 1,
        column: loc.start.column + 1
      };
      expect(nodeContainsPosition(node, pos)).toEqual(true);
    });

    it("should not contian position out of the start line", () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.start.line - 1,
        column: loc.start.column
      };
      expect(nodeContainsPosition(node, pos)).toEqual(false);
    });

    it("should not contian position out of the start column", () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.start.line,
        column: loc.start.column - 1
      };
      expect(nodeContainsPosition(node, pos)).toEqual(false);
    });

    it("should not contian position out of the end line", () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.end.line + 1,
        column: loc.end.column
      };
      expect(nodeContainsPosition(node, pos)).toEqual(false);
    });

    it("should not contian position out of the end column", () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.end.line,
        column: loc.end.column + 1
      };
      expect(nodeContainsPosition(node, pos)).toEqual(false);
    });

    it(`should contain position on the same start line and 
        within the start column`, () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.start.line,
        column: loc.start.column + 1
      };
      expect(nodeContainsPosition(node, pos)).toEqual(true);
    });

    it(`should contain position on the same end line and 
        within the end column`, () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.end.line,
        column: loc.end.column - 1
      };
      expect(nodeContainsPosition(node, pos)).toEqual(true);
    });
  });

  describe("node without the column criterion", () => {
    it("should contain position on the same start line", () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.start.line,
        column: loc.start.column - 1
      };
      loc.start.column = undefined;
      expect(nodeContainsPosition(node, pos)).toEqual(true);
    });

    it("should contain position on the same end line", () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.end.line,
        column: loc.end.column + 1
      };
      loc.end.column = undefined;
      expect(nodeContainsPosition(node, pos)).toEqual(true);
    });
  });

  describe("position without the column criterion", () => {
    it("should contain position on the same start line", () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.start.line
      };
      expect(nodeContainsPosition(node, pos)).toEqual(true);
    });

    it("should contain position on the same end line", () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.end.line
      };
      expect(nodeContainsPosition(node, pos)).toEqual(true);
    });
  });

  describe("node and position both without the column criteria", () => {
    it("should contain position on the same start line", () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.start.line
      };
      loc.start.column = undefined;
      expect(nodeContainsPosition(node, pos)).toEqual(true);
    });

    it("should contain position on the same end line", () => {
      const loc = getTestLoc();
      const node = { loc };
      const pos = {
        line: loc.end.line
      };
      loc.end.column = undefined;
      expect(nodeContainsPosition(node, pos)).toEqual(true);
    });
  });
});
