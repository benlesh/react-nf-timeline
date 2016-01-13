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
    const testClick = () => {
      window.alert('weeee!');
    };

    for (let i = 0; i < 1500; i++) {
      events.push(<NfTimelineEvent id={i} start={100} end={1000}>
          <NfTimelineEvent id={i + '-' + 0} start={200} end={750}>
            <NfTimelineEvent id={i + '-' + 0 + '-' + 0} start={250} end={450}/>
            <NfTimelineEvent id={i + '-' + 0 + '-' + 1} start={300} end={700}/>
            <NfTimelineEvent id={i + '-' + 0 + '-' + 2} start={620} end={750}/>
          </NfTimelineEvent>
          <NfTimelineEvent id={i + '-' + 1} start={500} end={900}/>
          <NfTimelineEvent id={i + '-' + 2} start={700} end={1000} onClick={testClick}/>
        </NfTimelineEvent>);
    }

    return events;
  }

  render() {
    return (
      <NfTimeline start={0} end={1200}>
        {this.getEvents()}
      </NfTimeline>
    );
  }
}
