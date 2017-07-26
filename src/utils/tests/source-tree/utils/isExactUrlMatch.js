import { isExactUrlMatch } from "../../../sources-tree";

describe("isExactUrlMatch", () => {
  it("recognizes root url match", () => {
    const rootA = "http://example.com/path/to/file.html";
    const rootB = "https://www.demo.com/index.html";

    expect(isExactUrlMatch("example.com", rootA)).toBe(true);
    expect(isExactUrlMatch("www.example.com", rootA)).toBe(true);
    expect(isExactUrlMatch("api.example.com", rootA)).toBe(false);
    expect(isExactUrlMatch("example.example.com", rootA)).toBe(false);
    expect(isExactUrlMatch("www.example.example.com", rootA)).toBe(false);
    expect(isExactUrlMatch("demo.com", rootA)).toBe(false);

    expect(isExactUrlMatch("demo.com", rootB)).toBe(true);
    expect(isExactUrlMatch("www.demo.com", rootB)).toBe(true);
    expect(isExactUrlMatch("maps.demo.com", rootB)).toBe(false);
    expect(isExactUrlMatch("demo.demo.com", rootB)).toBe(false);
    expect(isExactUrlMatch("www.demo.demo.com", rootB)).toBe(false);
    expect(isExactUrlMatch("example.com", rootB)).toBe(false);
  });
});
