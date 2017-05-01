import { createFactory } from "react";
import { shallow } from "enzyme";

import _Outline from "../../components/Outline";
const Outline = createFactory(_Outline.WrappedComponent);
import { setValue } from "devtools-config";

const fromJS = require("../../utils/fromJS");
import { getSourceText } from "../../test/unit/utils";

describe("Outline", () => {
  it("should render", () => {
    setValue("features.outline", true);
    const sourceText = fromJS(getSourceText("func"));
    const wrapper = shallow(
      new Outline({
        sourceText
      })
    );

    expect(wrapper).toMatchSnapshot();
  });
});
