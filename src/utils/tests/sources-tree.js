import { Map } from "immutable";
import {
  createNode,
  nodeHasChildren,
  addToTree,
  collapseTree,
  getDirectories,
  getURL,
  isExactUrlMatch,
  createTree,
  isDirectory
} from "../sources-tree.js";

describe("sources-tree", () => {
  const abcSource = Map({
    url: "http://example.com/a/b/c.js",
    actor: "actor1"
  });
  const abcdeSource = Map({
    url: "http://example.com/a/b/c/d/e.js",
    actor: "actor2"
  });
  const abxSource = Map({
    url: "http://example.com/a/b/x.js",
    actor: "actor3"
  });

  function createSourcesList(sources) {
    function makeSource(url, index) {
      return new Map({
        url,
        actor: `actor${index}`
      });
    }

    const msources = sources.map((s, i) => makeSource(s, i));
    let sourceList = Map();
    msources.forEach(s => {
      sourceList = sourceList.mergeIn([s.get("actor")], s);
    });

    return sourceList;
  }

  it("should provide node API", () => {
    const root = createNode("root", "", [createNode("foo", "/foo")]);
    expect(root.name).toBe("root");
    expect(nodeHasChildren(root)).toBe(true);
    expect(root.contents.length).toBe(1);

    const child = root.contents[0];
    expect(child.name).toBe("foo");
    expect(child.path).toBe("/foo");
    expect(child.contents).toBe(null);
    expect(nodeHasChildren(child)).toBe(false);
  });

  it("builds a path-based tree", () => {
    const source1 = Map({
      url: "http://example.com/foo/source1.js",
      actor: "actor1"
    });
    const tree = createNode("root", "", []);

    addToTree(tree, source1);
    expect(tree.contents.length).toBe(1);

    let base = tree.contents[0];
    expect(base.name).toBe("example.com");
    expect(base.contents.length).toBe(1);

    let fooNode = base.contents[0];
    expect(fooNode.name).toBe("foo");
    expect(fooNode.contents.length).toBe(1);

    let source1Node = fooNode.contents[0];
    expect(source1Node.name).toBe("source1.js");
  });

  it("does not attempt to add two of the same directory", () => {
    const sources = [
      "https://davidwalsh.name/wp-content/prism.js",
      "https://davidwalsh.name/"
    ];
    const sourceList = createSourcesList(sources);
    const tree = createTree(sourceList, "").sourceTree;
    expect(tree.contents.length).toBe(1);
    const subtree = tree.contents[0];
    expect(subtree.contents.length).toBe(2);
    expect(formatTree(tree)).toMatchSnapshot();
  });

  it("alphabetically sorts children", () => {
    const source1 = Map({
      url: "http://example.com/source1.js",
      actor: "actor1"
    });
    const source2 = Map({
      url: "http://example.com/foo/b_source2.js",
      actor: "actor2"
    });
    const source3 = Map({
      url: "http://example.com/foo/a_source3.js",
      actor: "actor3"
    });
    const tree = createNode("root", "", []);

    addToTree(tree, source1);
    addToTree(tree, source2);
    addToTree(tree, source3);

    let base = tree.contents[0];
    let fooNode = base.contents[0];
    expect(fooNode.name).toBe("foo");
    expect(fooNode.contents.length).toBe(2);

    let source1Node = base.contents[1];
    expect(source1Node.name).toBe("source1.js");

    // source2 should be after source1 alphabetically
    let source2Node = fooNode.contents[1];
    let source3Node = fooNode.contents[0];
    expect(source2Node.name).toBe("b_source2.js");
    expect(source3Node.name).toBe("a_source3.js");

    expect(formatTree(tree)).toMatchSnapshot();
  });

  it("sorts folders first", () => {
    const sources = [
      Map({
        url: "http://example.com/a.js",
        actor: "actor1"
      }),
      Map({
        url: "http://example.com/b.js/b_source.js",
        actor: "actor2"
      }),
      Map({
        url: "http://example.com/c.js",
        actor: "actor1"
      }),
      Map({
        url: "http://example.com",
        actor: "actor1"
      }),
      Map({
        url: "http://example.com/d/d_source.js",
        actor: "actor3"
      }),
      Map({
        url: "http://example.com/b2",
        actor: "actor2"
      })
    ];

    const tree = createNode("root", "", []);
    sources.forEach(source => addToTree(tree, source));
    const domain = tree.contents[0];

    const [
      indexNode,
      bFolderNode,
      b2FileNode,
      dFolderNode,
      aFileNode,
      cFileNode
    ] = domain.contents;

    expect(indexNode.name).toBe("(index)");
    expect(bFolderNode.name).toBe("b.js");
    expect(bFolderNode.contents.length).toBe(1);
    expect(bFolderNode.contents[0].name).toBe("b_source.js");

    expect(b2FileNode.name).toBe("b2");

    expect(dFolderNode.name).toBe("d");
    expect(dFolderNode.contents.length).toBe(1);
    expect(dFolderNode.contents[0].name).toBe("d_source.js");

    expect(aFileNode.name).toBe("a.js");

    expect(cFileNode.name).toBe("c.js");
    expect(formatTree(tree)).toMatchSnapshot();
  });

  it("puts folder at the top of the sort", () => {
    const sources = [
      Map({
        url: "http://example.com/folder/a.js",
        actor: "actor1"
      }),
      Map({
        url: "http://example.com/folder/b/b.js",
        actor: "actor2"
      }),
      Map({
        url: "http://example.com/folder/c/",
        actor: "actor1"
      })
    ];

    const tree = createNode("root", "", []);
    sources.forEach(source => addToTree(tree, source));
    const [
      bFolderNode,
      cFolderNode,
      aFileNode
    ] = tree.contents[0].contents[0].contents;

    expect(bFolderNode.name).toBe("b");
    expect(bFolderNode.contents.length).toBe(1);
    expect(bFolderNode.contents[0].name).toBe("b.js");

    expect(cFolderNode.name).toBe("c");
    expect(cFolderNode.contents.length).toBe(1);
    expect(cFolderNode.contents[0].name).toBe("(index)");

    expect(aFileNode.name).toBe("a.js");
  });

  it("puts root debugee url at the top of the sort", () => {
    const sources = [
      Map({
        url: "http://api.example.com/a.js",
        actor: "actor1"
      }),
      Map({
        url: "http://example.com/b.js",
        actor: "actor2"
      }),
      Map({
        url: "http://demo.com/c.js",
        actor: "actor3"
      })
    ];

    const rootA = "http://example.com/path/to/file.html";
    const rootB = "https://www.demo.com/index.html";
    const treeA = createNode("root", "", []);
    const treeB = createNode("root", "", []);
    sources.forEach(source => {
      addToTree(treeA, source, rootA);
      addToTree(treeB, source, rootB);
    });

    expect(treeA.contents[0].contents[0].name).toBe("b.js");
    expect(treeA.contents[1].contents[0].name).toBe("a.js");

    expect(treeB.contents[0].contents[0].name).toBe("c.js");
    expect(treeB.contents[1].contents[0].name).toBe("a.js");

    expect(formatTree(treeA)).toMatchSnapshot();
    expect(formatTree(treeB)).toMatchSnapshot();
  });

  it("excludes javascript: URLs from the tree", () => {
    const source1 = Map({
      url: "javascript:alert('Hello World')",
      actor: "actor1"
    });
    const source2 = Map({
      url: "http://example.com/source1.js",
      actor: "actor2"
    });
    const source3 = Map({
      url: "javascript:let i = 10; while (i > 0) i--; console.log(i);",
      actor: "actor3"
    });
    const tree = createNode("root", "", []);

    addToTree(tree, source1);
    addToTree(tree, source2);
    addToTree(tree, source3);

    let base = tree.contents[0];
    expect(tree.contents.length).toBe(1);

    let source1Node = base.contents[0];
    expect(source1Node.name).toBe("source1.js");
    expect(formatTree(tree)).toMatchSnapshot();
  });

  it("can collapse a single source", () => {
    const fullTree = createNode("root", "", []);
    addToTree(fullTree, abcSource);
    expect(fullTree.contents.length).toBe(1);
    const tree = collapseTree(fullTree);

    const host = tree.contents[0];
    expect(host.name).toBe("example.com");
    expect(host.contents.length).toBe(1);

    const abFolder = host.contents[0];
    expect(abFolder.name).toBe("a/b");
    expect(abFolder.contents.length).toBe(1);

    const abcNode = abFolder.contents[0];
    expect(abcNode.name).toBe("c.js");
    expect(abcNode.path).toBe("/example.com/a/b/c.js");
    expect(formatTree(tree)).toMatchSnapshot();
  });

  it("correctly merges in a collapsed source with a deeper level", () => {
    const fullTree = createNode("root", "", []);
    addToTree(fullTree, abcSource);
    addToTree(fullTree, abcdeSource);
    const tree = collapseTree(fullTree);
    //
    // expect(tree.contents.length).toBe(1);
    //
    // const host = tree.contents[0];
    // expect(host.name).toBe("example.com");
    // expect(host.contents.length).toBe(1);
    //
    // const abFolder = host.contents[0];
    // expect(abFolder.name).toBe("a/b");
    // expect(abFolder.contents.length).toBe(2);
    //
    // const [cdFolder, abcNode] = abFolder.contents;
    // expect(abcNode.name).toBe("c.js");
    // expect(abcNode.path).toBe("/example.com/a/b/c.js");
    // expect(cdFolder.name).toBe("c/d");
    //
    // const [abcdeNode] = cdFolder.contents;
    // expect(abcdeNode.name).toBe("e.js");
    // expect(abcdeNode.path).toBe("/example.com/a/b/c/d/e.js");
    console.log(formatTree(tree));
    expect(formatTree(tree)).toMatchSnapshot();
  });

  it("correctly merges in a collapsed source with a shallower level", () => {
    const fullTree = createNode("root", "", []);
    addToTree(fullTree, abcSource);
    addToTree(fullTree, abxSource);
    const tree = collapseTree(fullTree);

    expect(tree.contents.length).toBe(1);

    const host = tree.contents[0];
    expect(host.name).toBe("example.com");
    expect(host.contents.length).toBe(1);

    const abFolder = host.contents[0];
    expect(abFolder.name).toBe("a/b");
    expect(abFolder.contents.length).toBe(2);

    const [abcNode, abxNode] = abFolder.contents;
    expect(abcNode.name).toBe("c.js");
    expect(abcNode.path).toBe("/example.com/a/b/c.js");
    expect(abxNode.name).toBe("x.js");
    expect(abxNode.path).toBe("/example.com/a/b/x.js");
    expect(formatTree(tree)).toMatchSnapshot();
  });

  it("correctly merges in a collapsed source with the same level", () => {
    const fullTree = createNode("root", "", []);
    addToTree(fullTree, abcdeSource);
    addToTree(fullTree, abcSource);
    const tree = collapseTree(fullTree);

    expect(tree.contents.length).toBe(1);

    const host = tree.contents[0];
    expect(host.name).toBe("example.com");
    expect(host.contents.length).toBe(1);

    const abFolder = host.contents[0];
    expect(abFolder.name).toBe("a/b");
    expect(abFolder.contents.length).toBe(2);

    const [cdFolder, abcNode] = abFolder.contents;
    expect(abcNode.name).toBe("c.js");
    expect(abcNode.path).toBe("/example.com/a/b/c.js");
    expect(cdFolder.name).toBe("c/d");

    const [abcdeNode] = cdFolder.contents;
    expect(abcdeNode.name).toBe("e.js");
    expect(abcdeNode.path).toBe("/example.com/a/b/c/d/e.js");
    expect(formatTree(tree)).toMatchSnapshot();
  });

  it("identifies directories correctly", () => {
    const sources = [
      Map({
        url: "http://example.com/a.js",
        actor: "actor1"
      }),
      Map({
        url: "http://example.com/b/c/d.js",
        actor: "actor2"
      })
    ];

    const tree = createNode("root", "", []);
    sources.forEach(source => addToTree(tree, source));
    // const [bFolderNode, aFileNode] = tree.contents[0].contents;
    // const [cFolderNode] = bFolderNode.contents;
    // const [dFileNode] = cFolderNode.contents;

    console.log(formatTree(tree));
    expect(formatTree(tree)).toMatchSnapshot();
  });

  describe("addToTree", () => {
    it("correctly parses file sources correctly", () => {
      const source = Map({
        url: "file:///a/b.js",
        actor: "actor1"
      });
      const tree = createNode("root", "", []);

      addToTree(tree, source);
      expect(tree.contents.length).toBe(1);

      let base = tree.contents[0];
      expect(base.name).toBe("file://");
      expect(base.contents.length).toBe(1);

      const aNode = base.contents[0];
      expect(aNode.name).toBe("a");
      expect(aNode.contents.length).toBe(1);

      const bNode = aNode.contents[0];
      expect(bNode.name).toBe("b.js");
      expect(formatTree(tree)).toMatchSnapshot();
    });

    it("gets a source's ancestor directories", function() {
      const source1 = Map({
        url: "http://a/b.js",
        actor: "actor1"
      });

      const source2 = Map({
        url: "http://a/c.js",
        actor: "actor1"
      });

      const source3 = Map({
        url: "http://b/c.js",
        actor: "actor1"
      });

      const tree = createNode("root", "", []);
      addToTree(tree, source1);
      addToTree(tree, source2);
      addToTree(tree, source3);
      const paths = getDirectories("http://a/b.js", tree);

      expect(paths[1].path).toBe("/a");
      expect(paths[0].path).toBe("/a/b.js");
      expect(formatTree(tree)).toMatchSnapshot();
    });

    it("handles '?' in target url", function() {
      const source1 = Map({
        url: "http://a/b.js",
        actor: "actor1"
      });

      const source2 = Map({
        url: "http://b/b.js",
        actor: "actor1"
      });

      const tree = createNode("root", "", []);
      addToTree(tree, source1);
      addToTree(tree, source2);
      const paths = getDirectories("http://a/b.js?key=hi", tree);

      expect(paths[1].path).toBe("/a");
      expect(paths[0].path).toBe("/a/b.js");
      expect(formatTree(tree)).toMatchSnapshot();
    });

    it("handles 'https' in target url", function() {
      const source1 = Map({
        url: "https://a/b.js",
        actor: "actor1"
      });

      const source2 = Map({
        url: "https://b/b.js",
        actor: "actor1"
      });

      const tree = createNode("root", "", []);
      addToTree(tree, source1);
      addToTree(tree, source2);
      const paths = getDirectories("https://a/b.js", tree);

      expect(paths[1].path).toBe("/a");
      expect(paths[0].path).toBe("/a/b.js");
    });

    it("correctly parses webpack sources correctly", () => {
      const source = Map({
        url: "webpack:///a/b.js",
        actor: "actor1"
      });
      const tree = createNode("root", "", []);

      addToTree(tree, source);
      console.log(formatTree(tree));
      expect(formatTree(tree)).toMatchSnapshot();
    });

    it("files without an extension", () => {
      function createSourcesList(sources) {
        const msources = sources.map((s, i) => new Map(s));
        let sourceList = Map();
        msources.forEach(s => {
          sourceList = sourceList.mergeIn([s.get("id")], s);
        });

        return sourceList;
      }

      const testData = [
        {
          id: "server1.conn13.child1/39",
          url: "https://unpkg.com/codemirror/mode/xml/xml.js"
        },
        {
          id: "server1.conn13.child1/37",
          url: "https://unpkg.com/codemirror"
        }
      ];

      const x = `
  - root
  - unpkg.com
  - codemirror
  - (index)
   - mode
     - xml
       - xml.js

  `;

      const testMap = createSourcesList(testData);
      const tree = createTree(testMap);
      console.log(formatTree(tree.uncollapsedTree));
      expect(tree).toMatchSnapshot();
    });

    it("files without an extension 2", () => {
      function createSourcesList(sources) {
        const msources = sources.map((s, i) => new Map(s));
        let sourceList = Map();
        msources.forEach(s => {
          sourceList = sourceList.mergeIn([s.get("id")], s);
        });

        return sourceList;
      }

      const testData = [
        {
          id: "server1.conn13.child1/37",
          url: "https://unpkg.com/codemirror@5.1"
        },

        {
          id: "server1.conn13.child1/39",
          url: "https://unpkg.com/codemirror@5.1/mode/xml/xml.js"
        }
      ];

      const x = `
- root
- unpkg.com
 - codemirror
  - (index)
   - mode
     - xml
       - xml.js

`;

      const testMap = createSourcesList(testData);
      const tree = createTree(testMap);
      // console.log(tree.uncollapsedTree.contents[0])
      console.log("YOOO\n", formatTree(tree.uncollapsedTree));
      // expect(tree).toMatchSnapshot();
    });

    fit("files without an extension 2", () => {
      function createSourcesList(sources) {
        const msources = sources.map((s, i) => new Map(s));
        let sourceList = Map();
        msources.forEach(s => {
          sourceList = sourceList.mergeIn([s.get("id")], s);
        });

        return sourceList;
      }

      const testData = [
        {
          id: "server1.conn13.child1/37",
          url: "https://unpkg.com/codemirror"
        },

        {
          id: "server1.conn13.child1/39",
          url: "https://unpkg.com/codemirror/mode/xml/xml.js"
        }
      ];

      const x = `
    - root
    - unpkg.com
     - codemirror
      - (index)
       - mode
         - xml
           - xml.js

    `;

      const testMap = createSourcesList(testData);
      const tree = createTree(testMap);
      // console.log(tree.uncollapsedTree.contents[0])
      console.log("YOOO\n", formatTree(tree.uncollapsedTree));
      // expect(tree).toMatchSnapshot();
    });
  });
});

function formatTree(tree) {
  function _format(tree, depth = 0, str = "") {
    const whitespace = new Array(depth * 2).join(" ");
    str += `${whitespace} - ${tree.name}\n`;
    if (!tree.contents) {
      // return `${whitespace} - ${tree.name}`
    }

    if (tree.contents.length > 0) {
      tree.contents.forEach(t => {
        str = _format(t, depth + 1, str);
      });
    }

    return str;
  }

  return _format(tree);
}
