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
    markerStyle: PropTypes.object,
    onClick: PropTypes.func,
    hasChildren: PropTypes.boolean,
    visibleChildren: PropTypes.number,
    level: PropTypes.number
  };

  static defaultProps = {
    isCollapsed: false,
    isParentCollapsed: false,
    leftWidth: 150,
    scale: (x) => x,
    hasChildren: false,
    level: 0,
    visibleChildren: 0
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
    const { id, onToggleCollapse, isCollapsed, isParentCollapsed, level, visibleChildren,
      leftWidth, height, scale, end, start, onClick, markerStyle, hasChildren } = this.props;

    const toggleCollapse = ::this.toggleCollapse;
    const collapseButton = isCollapsed ? '▸' : '▾';

    const contentStyle = {
      height: `${height}px`
    };

    const markerHeight = height - 4;

    const leftPadding = (level * markerHeight) + (hasChildren ? 0 : 25);

    const leftSideStyle = {
      boxSizing: 'content-box',
      borderRight: '1px solid black',
      width: `${leftWidth - (leftPadding)}px`,
      paddingLeft: `${leftPadding}px`,
    };

    const rightSideStyle = {
      left: `${leftWidth}px`
    };

    const finalMarkerStyle = mixin({
      position: 'absolute',
      width: `${scale(end - start)}px`,
      left: `${scale(start)}px`,
      height: `${markerHeight}px`,
      marginTop: '2px',
      marginBottom: '2px',
      backgroundColor: '#ccccef',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#333333',
      boxSizing: 'border-box',
      cursor: onClick ? 'pointer' : ''
    }, markerStyle);

    const keyStyle = mixin({
      verticalAlign: 'middle',
      display: 'inline-block',
      width: `${height - 4}px`,
      height: `${height - 4}px`,
      marginTop: '2px',
      marginBottom: '2px',
      backgroundColor: '#ccccef',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#333333',
      boxSizing: 'border-box'
    }, markerStyle);

    const handleClick = ::this.handleClick;

    const button = this.props.hasChildren ? (<button className="nf-timeline-collapse-button" onClick={toggleCollapse}>{collapseButton}</button>) : null;

    const groupingStyle = {
      position: 'absolute',
      display: 'inline-block',
      top: '-1px',
      left: '-20px',
      borderLeft: '1px solid black',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
      width: '16px',
      height: `${((1 + visibleChildren) * height) - 6}px`
    };

    const grouping = hasChildren ? (<div className="nf-timeline-event-grouping" style={groupingStyle}>
      <button className="nf-timeline-grouping-collapse-button" onClick={toggleCollapse}>{collapseButton}</button>
    </div>) : null;

    return (<div className="nf-timeline-event">
      <div className="nf-timeline-event-content" style={contentStyle}>
        <div className="nf-timeline-event-left" style={leftSideStyle}>
          {button}
          <div className="nf-timeline-event-key" style={keyStyle}></div><span className="nf-timeline-event-name">{id}</span>
        </div>
        <div className="nf-timeline-event-right" style={rightSideStyle}>
          <div className="nf-timeline-event-marker" style={finalMarkerStyle} onClick={handleClick}>
            {grouping}
          </div>
        </div>
      </div>
    </div>);
  }
}
