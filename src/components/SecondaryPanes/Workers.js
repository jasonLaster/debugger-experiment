/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

import React, { Component } from "react";
import { connect } from "../../utils/connect";

import actions from "../../actions";
import { getThreads } from "../../selectors";
import { getDisplayName } from "../../utils/workers";
import { features } from "../../utils/prefs";
import Worker from "./Worker";
import AccessibleImage from "../shared/AccessibleImage";

import type { Thread, Worker as WorkerType } from "../../types";

import "./Workers.css";

type Props = {
  threads: Thread[],
  openWorkerToolbox: typeof actions.openWorkerToolbox
};

export class Workers extends Component<Props> {
  renderWorker(thread: WorkerType) {
    const { openWorkerToolbox } = this.props;

    return (
      <div
        className="worker"
        key={thread.actor}
        onClick={() => openWorkerToolbox(thread)}
      >
        <div clasName="icon">
          <AccessibleImage className={"worker"} />
        </div>
        <div className="label">{getDisplayName(thread)}</div>
      </div>
    );
  }

  renderWorkers() {
    const { threads } = this.props;

    if (features.windowlessWorkers) {
      return (threads: any).map(thread => (
        <Worker thread={thread} key={thread.actor} />
      ));
    }

    return (threads: any)
      .filter(thread => thread.actorID)
      .map(worker => this.renderWorker((worker: any)));
  }

  render() {
    return <div className="pane workers-list">{this.renderWorkers()}</div>;
  }
}

const mapStateToProps = state => ({
  threads: getThreads(state)
});

export default connect(
  mapStateToProps,
  {
    openWorkerToolbox: actions.openWorkerToolbox
  }
)(Workers);
