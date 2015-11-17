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
    for (let i = 0; i < 1500; i++) {
      events.push(<NfTimelineEvent id={i}>
          <NfTimelineEvent id={i + '-' + 0}>
            <NfTimelineEvent id={i + '-' + 0 + '-' + 0}/>
            <NfTimelineEvent id={i + '-' + 0 + '-' + 1}/>
            <NfTimelineEvent id={i + '-' + 0 + '-' + 2}/>
          </NfTimelineEvent>
          <NfTimelineEvent id={i + '-' + 1}/>
          <NfTimelineEvent id={i + '-' + 2}/>
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
