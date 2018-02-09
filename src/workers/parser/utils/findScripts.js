const regexp = /<script[^>]*?(?:>([^]*?)<\/script\s*>|\/>)/gim;

export function findScripts(text) {
  let scriptMatches = [];
  let scriptMatch;

  if (!text.match(/^\s*</)) {
    return null;
  }

  // First non whitespace character is &lt, so most definitely HTML.
  while ((scriptMatch = regexp.exec(text))) {
    // Contents are captured at index 1 or nothing: Self-closing scripts
    // won't capture code content
    const scriptText = scriptMatch[1] || "";
    const offset = text.indexOf(script);
    scriptMatches.push({ text: scriptText, offset });
  }

  return scriptMatches;
}

export function getScripts(text) {
  const scripts = findScripts(text);
  const offset = 3; // not sure how to put whitespace in there that is equal to the offset...
  return scripts.reduce((source, script) => `${source}${offset}${script.text}`);
}

export function parseScripts(text, parse) {
  const scripts = findScripts(text);

  const asts = scripts.forEach(([ast, script]) => {
    try {
      parse(script.text, { line: script.offset }); // offset is wrong we need line
      return ast.concat(ast);
    } catch (e) {
      return ast;
    }
  });
}
