const localEnvironment = require("devtools-local-environment");

const path = require("path");
const projectPath = path.join(__dirname, "public/js");

module.exports = envConfig => {
  const webpackConfig = {
    entry: {
      bundle: [path.join(projectPath, "main.js")],
      "source-map-worker": path.join(projectPath, "utils/source-map-worker.js"),
      "pretty-print-worker":
              path.join(projectPath, "utils/pretty-print-worker.js")
    },

    output: {
      path: path.join(__dirname, "public/build"),
      filename: "[name].js",
      publicPath: "/public/build"
    }
  }
  return localEnvironment.buildConfig(webpackConfig, envConfig);
};
