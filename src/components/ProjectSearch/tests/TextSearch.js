import React from "react";
import { shallow } from "enzyme";
import TextSearch from "../TextSearch.js";

function render(overrides = {}) {
  const defaultProps = {
    results: [],
    query: null,
    closeActiveSearch: jest.fn(),
    searchSources: jest.fn(),
    selectSource: jest.fn(),
    searchBottomBar: <div />
  };

  const props = Object.assign({}, defaultProps, overrides);

  const component = shallow(<TextSearch {...props} />);
  return { component, props };
}

describe("TextSearch", () => {
  it("basic", () => {
    const { component } = render();
    expect(component).toMatchSnapshot();
  });

  it("results + query", () => {
    const { component } = render({
      query: "foo",
      results: [
        {
          filepath: "bar.js",
          matches: [
            {
              sourceId: "foo",
              line: 12,
              column: 12,
              match: "foo",
              value: "bar foo foo",
              text: "bar foo foo"
            },
            {
              sourceId: "foo",
              line: 13,
              column: 23,
              match: "foo",
              value: "bar foo foo",
              text: "bar foo foo"
            }
          ]
        }
      ]
    });
    expect(component).toMatchSnapshot();
  });
});
