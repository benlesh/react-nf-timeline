import React, { Component, PropTypes } from 'react';

export default class NfTimelineRenderedEvent extends Component {
  static propTypes = {
    id: PropTypes.string,
    onToggleCollapse: PropTypes.func,
    isCollapsed: PropTypes.boolean,
    isParentCollapsed: PropTypes.boolean,
    width: PropTypes.number,
    height: PropTypes.number,
    value: PropTypes.any,
    text: PropTypes.string,
    start: PropTypes.number,
    end: PropTypes.number
  };

  static defaultProps = {
    isCollapsed: false,
    isParentCollapsed: false,
    width: 150
  };

  toggleCollapse() {
    const { id, onToggleCollapse } = this.props;
    if (onToggleCollapse) {
      onToggleCollapse(id);
    }
  }

  render() {
    const { id, onToggleCollapse, isCollapsed, isParentCollapsed, width, height } = this.props;
    const toggleCollapse = ::this.toggleCollapse;
    const collapseButton = isCollapsed ? '▸' : '▾';

    const contentStyle = {
      height: `${height}px`
    };

    const leftSideStyle = {
      borderRight: '1px solid black',
      width: `${width}px`
    };

    const rightSideStyle = {
      left: `${width}px`
    };

    return (<div className="nf-timeline-event">
      <div className="nf-timeline-event-content" style={contentStyle}>
        <div className="nf-timeline-event-left" style={leftSideStyle}>
          <button className="nf-timeline-collapse-button" onClick={toggleCollapse}>{collapseButton}</button>
          <span className="nf-timeline-event-name">{id}</span>
        </div>
        <div className="nf-timeline-event-right" style={rightSideStyle}>
          STUFF
        </div>
      </div>
    </div>);
  }
}
