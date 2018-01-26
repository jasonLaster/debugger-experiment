import { getSource } from "./helpers";
import getEmptyLines from "../getEmptyLines";
import { setSource } from "../sources";

describe("getEmptyLines", () => {
  it("allSymbols", () => {
    const source = getSource("allSymbols");
    setSource(source);
    expect(getEmptyLines("allSymbols")).toMatchSnapshot();
  });

  it("math", () => {
    const source = getSource("math");
    setSource(source);
    expect(getEmptyLines("math")).toMatchSnapshot();
  });

  it("class", () => {
    const source = getSource("class");
    setSource(source);
    expect(getEmptyLines("class")).toMatchSnapshot();
  });
});
