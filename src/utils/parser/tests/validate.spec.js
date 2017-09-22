import { validateSyntax } from "../validate";

describe("validate syntax", () => {
  it("should return the  valid expression", () => {
    expect(validateSyntax("foo")).toEqual("foo");
  });

  it("should return the error object for the invalid expression", () => {
    expect(validateSyntax("foo)(")).toMatchSnapshot();
  });
});
