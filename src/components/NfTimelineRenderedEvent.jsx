import React, { Component, PropTypes } from 'react';
import mixin from '../util/mixin';

export default class NfTimelineRenderedEvent extends Component {
  static propTypes = {
    id: PropTypes.string,
    onToggleCollapse: PropTypes.func,
    isCollapsed: PropTypes.boolean,
    isParentCollapsed: PropTypes.boolean,
    leftWidth: PropTypes.number,
    height: PropTypes.number,
    value: PropTypes.any,
    text: PropTypes.string,
    start: PropTypes.number,
    end: PropTypes.number,
    scale: PropTypes.func,
    style: PropTypes.object,
    onClick: PropTypes.func
  };

  static defaultProps = {
    isCollapsed: false,
    isParentCollapsed: false,
    leftWidth: 150,
    scale: (x) => x
  };

  toggleCollapse() {
    const { id, onToggleCollapse } = this.props;
    if (onToggleCollapse) {
      onToggleCollapse(id);
    }
  }

  handleClick(e) {
    const { id, value, onClick } = this.props;
    if (onClick) {
      onClick(id, value, e);
    }
  }

  render() {
    const { id, onToggleCollapse, isCollapsed, isParentCollapsed,
      leftWidth, height, scale, end, start, onClick, style } = this.props;

    const toggleCollapse = ::this.toggleCollapse;
    const collapseButton = isCollapsed ? '▸' : '▾';

    const contentStyle = {
      height: `${height}px`
    };

    const leftSideStyle = {
      borderRight: '1px solid black',
      width: `${leftWidth}px`
    };

    const rightSideStyle = {
      left: `${leftWidth}px`
    };

    const markerStyle = mixin({
      position: 'absolute',
      width: `${leftWidth + scale(end - start)}px`,
      left: `${leftWidth + scale(start)}px`,
      height: `${height - 4}px`,
      marginTop: '2px',
      marginBottom: '2px',
      backgroundColor: '#ccccef',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#333333',
      boxSizing: 'border-box',
      cursor: onClick ? 'pointer' : ''
    }, style);

    const handleClick = ::this.handleClick;

    return (<div className="nf-timeline-event">
      <div className="nf-timeline-event-content" style={contentStyle}>
        <div className="nf-timeline-event-left" style={leftSideStyle}>
          <button className="nf-timeline-collapse-button" onClick={toggleCollapse}>{collapseButton}</button>
          <span className="nf-timeline-event-name">{id}</span>
        </div>
        <div className="nf-timeline-event-right" style={rightSideStyle}>
          <div className="nf-timeline-event-marker" style={markerStyle} onClick={handleClick}/>
        </div>
      </div>
    </div>);
  }
}
