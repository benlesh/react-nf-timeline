import React, { Component, PropTypes } from 'react';

export default class NfTimelineEvent extends Component {
  static propTypes = {
    level: PropTypes.number,
    height: PropTypes.number,
    viewportOffset: PropTypes.number
  }

  static defaultProps = {
    level: 0,
    viewportOffset: 0
  }

  render() {
    const { level, height, viewportOffset } = this.props;
    const style = {
      'margin-left': level ? (level * 10) + 'px' : 0,
      'transform': `translate3d(0, ${viewportOffset - (viewportOffset % height)}px, 0)`
    };
    return (<div className="nf-timeline-event" style={style}>event {level}</div>);
  }
}
