import React, { Component } from 'react';
import applyStyles from 'react-css-modules';
import styles from './style.less';
import NfTimeline from '../../components/NfTimeline';
import NfTimelineEvent from '../../components/NfTimelineEvent';

let _id = 0;

export default
@applyStyles(styles)
class IndexPage extends Component {
  getEvents() {
    const events = [];
    for (let i = 0; i < 1000; i++) {
      events.push(<NfTimelineEvent>
          <NfTimelineEvent>
            <NfTimelineEvent/>
            <NfTimelineEvent/>
            <NfTimelineEvent/>
          </NfTimelineEvent>
          <NfTimelineEvent/>
          <NfTimelineEvent/>
        </NfTimelineEvent>);
    }

    return events;
  }

  render() {
    return (
      <NfTimeline height={800}>
        {this.getEvents()}
      </NfTimeline>
    );
  }
}
