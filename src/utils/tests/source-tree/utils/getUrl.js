import { getURL } from "../../../sources-tree";

describe("getURL", () => {
  it("handles normal url with http and https for filename", function() {
    const urlObject = getURL("https://a/b.js");
    const urlObject2 = getURL("http://a/b.js");
    expect(urlObject.filename).toBe("b.js");
    expect(urlObject2.filename).toBe("b.js");
  });

  it("handles url with querystring for filename", function() {
    const urlObject = getURL("https://a/b.js?key=randomeKey");
    expect(urlObject.filename).toBe("b.js");
  });

  it("handles url with '#' for filename", function() {
    const urlObject = getURL("https://a/b.js#specialSection");
    expect(urlObject.filename).toBe("b.js");
  });

  it("handles url with no filename for filename", function() {
    const urlObject = getURL("https://a/c");
    expect(urlObject.filename).toBe("(index)");
  });
});
