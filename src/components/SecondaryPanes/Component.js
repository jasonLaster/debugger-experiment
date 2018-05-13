/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import actions from "../../actions";

import { createObjectClient } from "../../client/firefox";

import { getSelectedFrame, getAllPopupObjectProperties } from "../../selectors";

import { ObjectInspector, ObjectInspectorUtils } from "devtools-reps";
import { isReactComponent } from "../../utils/preview";

import type { Frame } from "../../types";

const { createNode, getChildren } = ObjectInspectorUtils.node;
const { loadItemProperties } = ObjectInspectorUtils.loadProperties;

type Props = {
  setPopupObjectProperties: (Object, Object) => void,
  selectedFrame: Frame,
  popupObjectProperties: Object
};

class ComponentPane extends PureComponent<Props> {
  async componentWillMount() {
    const expression = "this;";
    // const { selectedFrame, setPopupObjectProperties } = this.props;
    // const value = selectedFrame.this;
    //
    // const root = createNode({ name: expression, contents: { value } });
    // const properties = await loadItemProperties(root, createObjectClient);
    // if (properties) {
    //   setPopupObjectProperties(value, properties);
    // }
  }

  render() {
    const { selectedFrame, popupObjectProperties } = this.props;
    const expression = "this;";
    if (!selectedFrame) {
      return null;
    }

    const value = selectedFrame.this;
    const root = {
      name: expression,
      path: expression,
      contents: { value }
    };

    const loadedRootProperties = popupObjectProperties[value.actor];
    if (!loadedRootProperties) {
      return null;
    }

    let roots = getChildren({
      item: root,
      loadedProperties: new Map([[root.path, loadedRootProperties]])
    });

    roots = roots.filter(r => ["state", "props"].includes(r.name));

    return (
      <div className="pane framework-component">
        <ObjectInspector
          roots={roots}
          autoExpandAll={false}
          autoExpandDepth={0}
          disableWrap={true}
          focusable={false}
          dimTopLevelWindow={true}
          createObjectClient={grip => createObjectClient(grip)}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedFrame: getSelectedFrame(state),
  popupObjectProperties: getAllPopupObjectProperties(state)
});

export default connect(mapStateToProps, actions)(ComponentPane);