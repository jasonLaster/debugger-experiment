// You can read more about custom commands here:
// https://on.cypress.io/api/commands
// ***********************************************

var deepMap = function(obj, valueTransform, keyTransform) {
  function isObject(value) {
    return {}.toString.call(value) == '[object Object]';
  }

  function getKeys(value) {
    if (isObject(value)) {
      return Object.keys(value)
    }

    if (!value) {
      return []
    }

    let keys = [];
    for (i=0; i < value.length; i++) {
      keys.push(i)
    }

    return keys;
  }

  return getKeys(obj).reduce(function(acc, k) {
    if (typeof obj[k] == 'object') {
      const key = keyTransform(k)
      acc[key] = deepMap(obj[k], valueTransform, keyTransform)
    } else {
      acc[k] = valueTransform(obj[k], k)
    }
    return acc
  },{})
}

function sanitizeData(data) {
  return deepMap(data, (value, key) => {
    if (typeof value != "string") {
      return value;
    }

    if (value.match(/server.*child/)) {
      return value.replace(/server.*child.*\//,"");
    }

    return value;
  }, (key) => {
    if (typeof key != "string") {
      return key;
    }

    if (key.match(/server.*child/)) {
      return key.replace(/server.*child.*\//,"");
    }

    return key;
  })
}

/**
 saveFixture takes a fixture name and saves the current app state
 to a fixture file in public/js/test/fixtures
*/
Cypress.addParentCommand("saveFixture", function(fixtureName) {
  return cy.window().then(win => {
    const events = win.clientEventLog;
    const commands = win.clientCommandLog;
    const appState = JSON.parse(JSON.stringify(win.store.getState()));

    const fixture = sanitizeData({appState, events, commands});
    const fixtureText = JSON.stringify(fixture, null, "  ");
    return cy.request("post", "http://localhost:8001/save-fixture", {
      fixtureName: fixtureName,
      fixtureText: fixtureText
    });
  });
})



Cypress.addParentCommand("debuggee", function(callback) {
  /**
   * gets a fat arrow function and returns the function body
   * `() => { example }` => `example`
   */
  function getFunctionBody(cb) {
    const source = cb.toString();
    const firstCurly = source.toString().indexOf("{");
    return source.slice(firstCurly + 1, -1).trim();
  }

  const script = getFunctionBody(callback);

  return cy.window().then(win => {
    win.injectDebuggee();
    // NOTE: we should be returning a promise here.
    // The problem is if, the client pauses we need to handle that
    // gracefully and resume. We did this on the test-server.
    win.clientCommands.evaluate(script).then(response => {
      if (response.exception) {
        const errorMsg = response.exceptionMessage;
        const commandInput = response.input;
        console.error(`${errorMsg}\n For command:\n${commandInput}`);
      }
    });
  });
});

Cypress.addParentCommand("navigate", function(url) {
  url = "http://localhost:8000/" + url;
  return cy.window().then(win => {
    return win.clientCommands.navigate(url);
  });
})
