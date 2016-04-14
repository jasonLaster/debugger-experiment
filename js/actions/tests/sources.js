"use strict";

const { createStore, actions, queries,
  Task, waitForState, commonLog } = require("../../util/test-head");

const mockThreadClient = {
  currentSourceText: {
    "foo1": { source: "function() {\n  return 5;\n}",
              contentType: "text/javascript" },
    "foo2": { source: "function(x, y) {\n  return x + y;\n}",
              contentType: "text/javascript" }
  },

  source: function(form) {
    return {
      source: () => {
        return new Promise((resolve, reject) => {
          resolve(mockThreadClient.currentSourceText[form.actor]);
        });
      }
    };
  }
};

const store = createStore(mockThreadClient);

function run_test() {
  old_test();
  Task.spawn(function* () {
    commonLog("inside spawn");
    store.dispatch(actions.loadSourceText({ actor: "foo1" }));

    yield waitForState(() => {
      return queries.getSourceText(store.getState(), "foo1");
    });

    equal(queries.getSourceText(store.getState(), "foo1").text,
          "function() {\n  return 7;\n}");
  });

  dump("outside spawn");
  run_next_test();
}

function old_test() {
  store.dispatch(actions.newSource({
    url: "http://example.com/foo1.js",
    actor: "foo1"
  }));
  store.dispatch(actions.newSource({
    url: "http://example.com/foo2.js",
    actor: "foo2"
  }));

  equal(queries.getSourceCount(store.getState()), 2);
  const foo1 = queries.getSourceByURL(store.getState(),
                                      "http://example.com/foo1.js");
  const foo2 = queries.getSourceByURL(store.getState(),
                                      "http://example.com/foo2.js");
  ok(foo1, "foo1 exists");
  equal(foo1.actor, "foo1");
  ok(foo2, "foo2 exists");
  equal(foo2.actor, "foo2");
}
