const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const hankey = require("hankey");

function exec(cmd) {
  const { stdout, stderr, code } = shell.exec(cmd, { silent: true });
}

function asyncExec(command = "", {
  onLine =  () => {},
  onFinish = () => {},
  onErrorLine =  () => {}
}) {

  return new Promise(resolve => {
    const child = shell.exec(
      command,
      { async: true, silent: true },
      code => {
        onFinish(code)
        resolve(code)
      }
    );

    child.stdout.on("data", function(data) {
      data = data.trim();
      data.split("\n").forEach(onLine);
    });

    child.stderr.on("data", function(data) {
      data = data.trim();
      data.split("\n").forEach(onErrorLine);
    });
  })
}

async function startCopying() {
  return (new Promise(r => r))
  hankey.action(":train: Starting WebPack")
  return new Promise(resolve => {
    function onLine(line) {
      console.log(line)
      if (line.includes("Done copying")) {
        // resolve();
      }
    }

    // asyncExec(`node bin/copy-assets-watch`, { onLine })
  })
}

function buildFirefox() {
  hankey.action(":hammer: Building Firefox");
  const {code, stderr, stdout} = exec("./mach build");
  if (code !== 0) {
    hankey.error(":bomb: Build Failed")
    console.log(stdout, stderr)
    return false;
  }

  return true;
}

async function startFirefox() {
  hankey.action(":dizzy: Starting Firefox");
  onLine  = line => console.log(`-- ${line}`)
  function onDone(code) {
  }

  return asyncExec("./mach run -P dev --jsdebugger", {onLine, onDone});
}

(async () => {

  if (!shell.test("-d", "./firefox")) {
    hankey.error("Oops, looksl like you need to install firefox")
    hankey.info("Checkout the docs: ")
  }

  await startCopying()
  //
  // shell.cd("./firefox");
  // while (true) {
  //   const success = buildFirefox();
  //   if (!success) {
  //     hankey.action(":wave: Exiting!")
  //     return;
  //   }
  //
  //   await startFirefox();
  // }
})();
