import * as parser from "../workers/parser";

window.parser = parser;
console.log("YOOO");

let id = 1;

window.getSymbols = function() {
  const text = window.code.value;
  const source = { id: `source-${id}`, text, contentType: "javascript" };
  parser.setSource(source);
  const symbols = parser.getSymbols(source.id);
  console.log(symbols);
};
