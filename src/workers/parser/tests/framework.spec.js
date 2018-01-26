import { isReactComponent } from "../frameworks";
import { getSource } from "./helpers";
import { setSource } from "../sources";

describe("Parser.frameworks", () => {
  it("should be a react component", () => {
    const source = getSource("frameworks/component");
    setSource(source);
    expect(isReactComponent("frameworks/component")).toBe(true);
  });

  it("should handle es5 implementation of a component", () => {
    const source = getSource("frameworks/es5Component");
    setSource(source);
    expect(isReactComponent("frameworks/es5Component")).toBe(true);
  });
});
