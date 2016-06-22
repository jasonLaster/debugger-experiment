"use strict";

// const { actions, selectors, createStore } = require("../../util/test-head");
const { mockClientStore } = require("../test-utils");
const fixtures = require("../../test/fixtures/foobar.json");
const fromJS = require("../../util/fromJS");
const expect = require("expect.js");
const { Task } = require("devtools-sham/sham/task");

const sourcesFixtures = fixtures.sources;

function _getSourceText(id) {
  return fixtures.sources.sourcesText[id];
}

function _getSource(id) {
  return fixtures.sources.sources[id];
}

describe("sources", function() {
  describe("selectSource", function() {
    it("selecting an already loaded source", function() {
      const initialState = {
        sources: fromJS({
          sources: {
            "fooSourceActor": _getSource("fooSourceActor")
          },
          sourcesText: {
            "fooSourceActor": _getSource("fooSourceActor")
          },
          tabs: []
        })
      };

      const {
        selectSource, getSelectedSource, getSourceTabs
      } = mockClientStore(initialState, fixtures);

      selectSource(sourcesFixtures.sources.fooSourceActor.id)

      const fooSelectedSource = getSelectedSource();
      expect(fooSelectedSource.get("id")).to.equal("fooSourceActor");

      const sourceTabs = getSourceTabs();
      expect(sourceTabs.count()).to.equal(1);
      expect(sourceTabs.get(0).get("id")).to.equal("fooSourceActor");
    });

    it("selecting a source that hasn\'t been loaded", function() {
      const initialState = {
        sources: fromJS({
          sources: {
            "fooSourceActor": _getSource("fooSourceActor")
          },
          sourcesText: {},
          tabs: []
        })
      };

      const {
        selectSource, getSelectedSource, getSourceTabs
      } = mockClientStore(initialState, fixtures);

      selectSource(sourcesFixtures.sources.fooSourceActor.id)

      const fooSelectedSource = getSelectedSource();
      expect(fooSelectedSource.get("id")).to.equal("fooSourceActor");

      const sourceTabs = getSourceTabs();
      expect(sourceTabs.count()).to.equal(1);
      expect(sourceTabs.get(0).get("id")).to.equal("fooSourceActor");
    });
  });

  describe("loadSourceText", function() {
    it("loading one source text", function(done) {
      const initialState = {
        sources: fromJS({
          sourcesText: sourcesFixtures.sourcesText
        })
      };

      Task.spawn(function* () {
        const {
          loadSourceText, getSourceText
        } = mockClientStore(initialState, fixtures);

        yield loadSourceText({ id: "fooSourceActor" });

        const fooSourceText = getSourceText("fooSourceActor");
        expect(fooSourceText.get("text")).to.equal(_getSourceText("fooSourceActor").text);
        done();
      });
    });

    it("loading two different sources", function(done) {
      Task.spawn(function* () {
        const initialState = { sources: fromJS({
          sourcesText: {}
        }) };

        const {
          loadSourceText, getSourceText
        } = mockClientStore(initialState, fixtures);

        yield loadSourceText({ id: "fooSourceActor" });
        yield loadSourceText({ id: "barSourceActor" });

        const fooSourceText = getSourceText("fooSourceActor");
        const barSourceText = getSourceText("barSourceActor");
        debugger
        expect(fooSourceText.get("text")).to.equal(_getSourceText("fooSourceActor").text);

        expect(barSourceText.get("text")).to.equal(_getSourceText("barSourceActor").text);

        done();
      });
    });
  });
});
