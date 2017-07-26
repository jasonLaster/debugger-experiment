// @flow

/**
 * Utils for Sources Tree Component
 * @module utils/sources-tree
 */

import { parse } from "url";
import assert from "./DevToolsUtils";
import { isPretty } from "./source";
import merge from "lodash/merge";

const IGNORED_URLS = ["debugger eval code", "XStringBundle"];

/**
 * Temporary Source type to be used only within this module
 * TODO: Replace with real Source type definition when refactoring types
 * @memberof utils/sources-tree
 * @static
 */
type TmpSource = { get: (key: string) => string, toJS: Function };

/**
 * TODO: createNode is exported so this type could be useful to other modules
 * @memberof utils/sources-tree
 * @static
 */
type Node = {
  name: string,
  path: string,
  contents: Node | SourceRecord | List<SourceRecord> | null
};

type UrlType = { path: string, group: string, filename: string };

/**
 * @memberof utils/sources-tree
 * @static
 */
function nodeHasChildren(item: Node): boolean {
  return Array.isArray(item.contents);
}

/**
 * @memberof utils/sources-tree
 * @static
 */
function createNode(name: string, path: string, contents?: Node): Node {
  return {
    name,
    path,
    contents: contents || null
  };
}

/**
 * @memberof utils/sources-tree
 * @static
 */
function createParentMap(tree: any): WeakMap<any, any> {
  const map = new WeakMap();

  function _traverse(subtree) {
    if (nodeHasChildren(subtree)) {
      for (let child of subtree.contents) {
        map.set(child, subtree);
        _traverse(child);
      }
    }
  }

  // Don't link each top-level path to the "root" node because the
  // user never sees the root
  tree.contents.forEach(_traverse);
  return map;
}

/**
 * @memberof utils/sources-tree
 * @static
 */
function getFilenameFromPath(pathname?: string) {
  let filename = "";
  if (pathname) {
    filename = pathname.substring(pathname.lastIndexOf("/") + 1);
    // This file does not have a name. Default should be (index).
    if (filename == "" || !filename.includes(".")) {
      filename = "(index)";
    }
  }
  return filename;
}

/**
 * @memberof utils/sources-tree
 * @static
 */
function getURL(sourceUrl: string): UrlType {
  const url = sourceUrl;
  let def = { path: "", group: "", filename: "" };
  if (!url) {
    return def;
  }

  const { pathname, protocol, host, path } = parse(url);
  const filename = getFilenameFromPath(pathname);

  switch (protocol) {
    case "javascript:":
      // Ignore `javascript:` URLs for now
      return def;

    case "about:":
      // An about page is a special case
      return merge(def, {
        path: "/",
        group: url,
        filename: filename
      });

    case null:
      if (pathname && pathname.startsWith("/")) {
        // If it's just a URL like "/foo/bar.js", resolve it to the file
        // protocol
        return merge(def, {
          path: path,
          group: "file://",
          filename: filename
        });
      } else if (host === null) {
        // We don't know what group to put this under, and it's a script
        // with a weird URL. Just group them all under an anonymous group.
        return merge(def, {
          path: url,
          group: "(no domain)",
          filename: filename
        });
      }
      break;

    case "http:":
    case "https:":
      return merge(def, {
        path: pathname,
        group: host,
        filename: filename
      });
  }

  return merge(def, {
    path: path,
    group: protocol ? `${protocol}//` : "",
    filename: filename
  });
}

/**
 * @memberof utils/sources-tree
 * @static
 */
function isDirectory(url: UrlType) {
  const parts = url.path.split("/").filter(p => p !== "");
  const isRoot = parts.length === 0;
  const endsWithSlash = url.path.slice(-1) === "/";
  // Assume that all urls point to files except when they end with '/'
  // Or directory node has children

  return isRoot || endsWithSlash;
}

/**
 * @memberof utils/sources-tree
 * @static
 */
function addToTree(tree: any, source: TmpSource, debuggeeUrl: string) {
  const url = getURL(source.get("url"));

  if (
    IGNORED_URLS.indexOf(url) != -1 ||
    !source.get("url") ||
    !url.group ||
    isPretty(source.toJS())
  ) {
    return;
  }

  url.path = decodeURIComponent(url.path);

  const parts = url.path.split("/").filter(p => p !== "");
  parts.unshift(url.group);

  let path = "";
  let subtree = tree;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const isLastPart = i === parts.length - 1;
    console.log({ part });

    // TODO: Be smarter about this, which we'll probably do when we
    // are smarter about folders and collapsing empty ones.
    if (nodeHasChildren(subtree)) {
      console.log(`node has children`);
      const child = subtree.contents.find(c => c.name === part);
      console.log({ part, child });
      // console.log({ children, child })
      if (child) {
        // A node with the same name already exists, simply traverse
        // into it.
        subtree = child;
      } else {
        // No node with this name exists, so insert a new one in the
        // place that is alphabetically sorted.
        const node = createNode(part, `${path}/${part}`, []);
        let where = determineFileSortOrder(
          subtree.contents,
          part,
          isLastPart,
          i === 0 ? debuggeeUrl : ""
        );

        subtree.contents.splice(where, 0, node);
        subtree = subtree.contents[where];
      }
    } else {
      console.log("replace file w/ directory");

      const source = subtree.contents;
      const url = getURL(source.get("url"));
      const name = getFilenameFromPath(url.path);

      const newDir = createNode(part, `${path}/${part}`, []);
      const newSource = createNode(name, `${path}/${part}`, source);
      subtree.contents = [newDir, newSource];
      subtree = subtree.contents[0];
    }

    // Keep track of the children so we can tag each node with them.
    path = `${path}/${part}`;
  }

  // Overwrite the contents of the final node to store the source
  // there.
  // const hasIndex = subtree.contents.find(c => c.name === "(index)");
  const isFile = !isDirectory(url);
  if (isFile && !nodeHasChildren(subtree)) {
    subtree.contents = source;
  } else {
    const name = getFilenameFromPath(url.path);
    console.log("add file", name, source.get("url"));
    subtree.contents.unshift(createNode(name, source.get("url"), source));
  }
}

/**
 * @memberof utils/sources-tree
 * @static
 */
function isExactUrlMatch(pathPart: string, debuggeeUrl: string) {
  // compare to hostname with an optional 'www.' prefix
  const { host } = parse(debuggeeUrl);
  if (!host) {
    return false;
  }
  return host.replace(/^www\./, "") === pathPart.replace(/^www\./, "");
}

/**
 * Look at the nodes in the source tree, and determine the index of where to
 * insert a new node. The ordering is index -> folder -> file.
 * @memberof utils/sources-tree
 * @static
 */
function determineFileSortOrder(
  nodes: Array<Node>,
  pathPart: string,
  isLastPart: boolean,
  debuggeeUrl: string
) {
  const partIsDir = !isLastPart || pathPart.indexOf(".") === -1;

  const index = nodes.findIndex(node => {
    const nodeIsDir = nodeHasChildren(node);

    // The index will always be the first thing, so this pathPart will be
    // after it.
    if (node.name === "(index)") {
      return false;
    }

    // Directory or not, checking root url must be done first
    if (debuggeeUrl) {
      const rootUrlMatch = isExactUrlMatch(pathPart, debuggeeUrl);
      const nodeUrlMatch = isExactUrlMatch(node.name, debuggeeUrl);
      if (rootUrlMatch) {
        // pathPart matches root url and must go first
        return true;
      }
      if (nodeUrlMatch) {
        // Examined item matches root url and must go first
        return false;
      }
      // If neither is the case, continue to compare alphabetically
    }

    // If both the pathPart and node are the same type, then compare them
    // alphabetically.
    if (partIsDir === nodeIsDir) {
      return node.name.localeCompare(pathPart) >= 0;
    }

    // If the pathPart and node differ, then stop here if the pathPart is a
    // directory. Keep on searching if the part is a file, as it needs to be
    // placed after the directories.
    return partIsDir;
  });

  return index === -1 ? nodes.length : index;
}

/**
 * Take an existing source tree, and return a new one with collapsed nodes.
 * @memberof utils/sources-tree
 * @static
 */
function collapseTree(node: any, depth: number = 0) {
  // Node is a folder.
  if (nodeHasChildren(node)) {
    // Node is not a root/domain node, and only contains 1 item.
    if (depth > 1 && node.contents.length === 1) {
      const next = node.contents[0];
      // Do not collapse if the next node is a leaf node.
      if (nodeHasChildren(next)) {
        return collapseTree(
          createNode(`${node.name}/${next.name}`, next.path, next.contents),
          depth + 1
        );
      }
    }
    // Map the contents.
    return createNode(
      node.name,
      node.path,
      node.contents.map(next => collapseTree(next, depth + 1))
    );
  }
  // Node is a leaf, not a folder, do not modify it.
  return node;
}

/**
 * @memberof utils/sources-tree
 * @static
 */
function createTree(sources: any, debuggeeUrl: string) {
  const uncollapsedTree = createNode("root", "", []);
  for (let source of sources.valueSeq()) {
    // console.log(uncollapsedTree)
    addToTree(uncollapsedTree, source, debuggeeUrl);
  }

  const sourceTree = collapseTree(uncollapsedTree);

  return {
    uncollapsedTree,
    sourceTree,
    parentMap: createParentMap(sourceTree),
    focusedItem: null
  };
}

function findSource(sourceTree: any, sourceUrl: string) {
  let returnTarget = null;
  function _traverse(subtree) {
    if (nodeHasChildren(subtree)) {
      for (let child of subtree.contents) {
        _traverse(child);
      }
    } else if (
      !returnTarget &&
      subtree.path.replace(/http(s)?:\//, "") == sourceUrl
    ) {
      returnTarget = subtree;
      return;
    }
  }

  sourceTree.contents.forEach(_traverse);
  return returnTarget;
}

function getDirectories(sourceUrl: string, sourceTree: any) {
  const url = getURL(sourceUrl);
  const fullUrl = `/${url.group}${url.path}`;
  const parentMap = createParentMap(sourceTree);
  const source = findSource(sourceTree, fullUrl);

  if (!source) {
    return [];
  }

  let node = source;
  let directories = [];
  directories.push(source);
  while (true) {
    node = parentMap.get(node);
    if (!node) {
      return directories;
    }
    directories.push(node);
  }
}

export {
  createNode,
  nodeHasChildren,
  createParentMap,
  isDirectory,
  addToTree,
  collapseTree,
  createTree,
  getDirectories,
  getURL,
  isExactUrlMatch
};
