const {
  makeNodesForProperties
} = require("../object-inspector");

const expect = require("expect.js");

const smallArray = [];

describe("object inspector", () => {
  describe("make nodes for props", () => {
    it("small array", () => {
      const nodes = makeNodesForProperties(smallArray);
      expect(nodes).to.equal(2);
    });
  });
});
