// @flow

const fs = require("fs");
const path = require("path");

export function getSourceText(name) {
  const text = fs.readFileSync(
    path.join(__dirname, `fixtures/${name}.js`),
    "utf8"
  );
  return {
    id: name,
    text: text,
    contentType: "text/javascript"
  };
}
