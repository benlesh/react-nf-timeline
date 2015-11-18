import React, { Component, PropTypes } from 'react';

export default class NfTimelineRenderedEvent extends Component {
  static propTypes = {
    id: PropTypes.string,
    onToggleCollapse: PropTypes.func,
    isCollapsed: PropTypes.boolean,
    isParentCollapsed: PropTypes.boolean
  };

  static defaultProps = {
    isCollapsed: false,
    isParentCollapsed: false
  };

  toggleCollapse() {
    const { id, onToggleCollapse } = this.props;
    if (onToggleCollapse) {
      onToggleCollapse(id);
    }
  }

  render() {
    const { id, onToggleCollapse, isCollapsed, isParentCollapsed } = this.props;
    const toggleCollapse = ::this.toggleCollapse;
    return (<div className="nf-timeline-event"><button onClick={toggleCollapse}>T</button>Event - {id}
      - {'' + isCollapsed} - {'' + isParentCollapsed}</div>);
  }
}
