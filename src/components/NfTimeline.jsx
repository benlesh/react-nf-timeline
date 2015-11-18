import React, { Component, PropTypes } from 'react';
import NfTimelineRenderedEvent from './NfTimelineRenderedEvent';

export default class NfTimeline extends Component {
  static propTypes = {
    eventHeight: PropTypes.number,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired
  }

  static defaultProps = {
    height: 100,
    eventHeight: 20
  }

  constructor(props) {
    super(props);
    const treeState = this.getTreeState(props.children);
    const events = this.getEvents(treeState, 0, props.height, props.eventHeight);

    this.state = {
      viewportOffset: 0,
      treeState,
      events
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      const treeState = this.getTreeState(nextProps.children);
      const events = this.getEvents(treeState, this.state.viewportOffset, nextProps.height, nextProps.eventHeight);

      this.setState({
        treeState,
        events
      });
    }
  }


  getStartIndex(viewportOffset, eventHeight) {
    return Math.max(Math.floor(viewportOffset / eventHeight) - 1, 0);
  }

  getDisplayCount(height, eventHeight) {
    return Math.ceil(this.props.height / this.props.eventHeight) + 2;
  }


  getTreeState(children) {
    const crawl = function crawl(children, treeState, parent) {
      const arr = React.Children.toArray(children);
      const len = arr.length;
      for (let i = 0; i < len; i++) {
        let child = arr[i];
        let isCollapsed = child.props.collapse;
        let id = child.props.id;
        let isParentCollapsed = Boolean(parent && (parent.isCollapsed || parent.isParentCollapsed));
        let node = createNode(isCollapsed, id, isParentCollapsed);

        treeState.push(node);

        if (parent) {
          parent.children.push(node);
        }

        crawl(child.props.children, treeState, node);
      }
    };

    const treeState = [];

    crawl(children, treeState, null);

    return treeState;
  }

  toggleCollapse(id) {
    const treeState = this.state.treeState;
    const index = treeState.findIndex(x => x.id === id);

    if (index !== -1) {
      const node = treeState[index];

      node.isCollapsed = !node.isCollapsed;

      const collapse = (node) => {
        node.children.forEach(child => {
          child.isParentCollapsed = node.isCollapsed || node.isParentCollapsed;
          collapse(child);
        });
      };

      collapse(node);

      const events = this.getEvents(treeState, this.state.viewportOffset, this.props.height, this.props.eventHeight);
      this.setState({
        treeState,
        events
      });
    }
  }

  getEvents(treeState, viewportOffset, height, eventHeight) {
    const displayCount = this.getDisplayCount(height, eventHeight);
    const startIndex = this.getStartIndex(viewportOffset, eventHeight);
    const len = treeState.length;
    const endIndex = startIndex + displayCount;
    const events = [];
    const toggleCollapse = ::this.toggleCollapse;

    for (let i = 0, offset = 0; i < len; i++) {
      let node = treeState[i];
      if (node.isParentCollapsed) {
        offset += 1;
        continue;
      }
      if (startIndex + offset <= i && i <= endIndex + offset) {
        events.push((<NfTimelineRenderedEvent id={node.id} isCollapsed={node.isCollapsed}
            isParentCollapsed={node.isParentCollapsed} onToggleCollapse={toggleCollapse}/>));
      }
    }

    return events;
  }

  getViewportStyle() {
    return {
      height: this.props.height + 'px',
      overflowY: 'scroll'
    };
  }

  getContentStyle(total) {
    return {
      height: (this.props.eventHeight * total) + 'px'
    };
  }

  getOffsetStyle() {
    const eventHeight = this.props.eventHeight;
    const viewportOffset = this.state.viewportOffset;
    const startIndex = this.getStartIndex(viewportOffset, eventHeight);
    const offset = startIndex * eventHeight;
    return {
      transform: `translate3d(0, ${offset}px, 0)`
    };
  }

  viewportScrolled(e) {
    const viewportOffset = e.target.scrollTop;
    const { state: { treeState }, props: { height, eventHeight } } = this;
    const events = this.getEvents(treeState, viewportOffset, height, eventHeight);
    this.setState({
      viewportOffset,
      events
    });
  }

  render() {
    const { treeState, events } = this.state;
    const total = treeState.length;
    const contentStyle = this.getContentStyle(total);
    const viewportStyle = this.getViewportStyle();
    const offsetStyle = this.getOffsetStyle();

    return (<div className="nf-timeline">
      <div onScroll={::this.viewportScrolled} className="nf-timeline-viewport" style={viewportStyle}>
        <div className="nf-timeline-content" style={contentStyle}>
          <div className="nf-timeline-inner-offset" style={offsetStyle}>
            {events}
          </div>
        </div>
      </div>
    </div>);
  }
}

function createNode(isCollapsed, id, isParentCollapsed, children = []) {
  return {
    isCollapsed,
    children,
    id,
    isParentCollapsed
  };
}
