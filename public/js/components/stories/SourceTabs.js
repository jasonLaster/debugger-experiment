"use strict";
const React = require("react");
const { DOM: dom, createElement, createFactory } = React;
const { renderComponent, storiesOf } = require("./utils");

const SourceTabs = require("../SourceTabs");

const style = {
  width: "300px",
  margin: "auto",
  paddingTop: "100px" };

const component = createElement(createFactory(SourceTabs));

function renderSourceTabs(fixtureName) {
  return renderComponent(component, fixtureName, { style });
}

storiesOf("SourceTabs", module)
  .add("One Tab", () => renderSourceTabs("todomvcUpdateOnEnter"))
  .add("Many Tabs", () => renderSourceTabs("todomvc"));
