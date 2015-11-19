import React, { Component, PropTypes } from 'react';

export default class NfTimelineRenderedEvent extends Component {
  static propTypes = {
    id: PropTypes.string,
    onToggleCollapse: PropTypes.func,
    isCollapsed: PropTypes.boolean,
    isParentCollapsed: PropTypes.boolean,
    width: PropTypes.number
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
    const { id, onToggleCollapse, isCollapsed, isParentCollapsed, width } = this.props;
    const toggleCollapse = ::this.toggleCollapse;
    const collapseButton = isCollapsed ? '▸' : '▾'; // Webdings for arrows
    const collapseButtonStyle = NfTimelineRenderedEvent.collapseButtonStyle;
    const leftSideStyle = {
      borderRight: '1px solid black',
      width: `${width}px`
    };

    return (<div className="nf-timeline-event">
      <div style={leftSideStyle}>
        <button className="nf-timeline-collapse-button" onClick={toggleCollapse}>{collapseButton}</button>
        <span className="nf-timeline-event-name">{id}</span>
      </div>
    </div>);
  }
}
