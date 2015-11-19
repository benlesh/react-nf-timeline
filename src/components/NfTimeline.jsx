import React, { Component, PropTypes } from 'react';
import NfTimelineRenderedEvent from './NfTimelineRenderedEvent';
import linearScale from '../util/linearScale';

export default class NfTimeline extends Component {
  static propTypes = {
    eventHeight: PropTypes.number,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    start: PropTypes.number,
    end: PropTypes.number
  }

  static defaultProps = {
    height: 100,
    width: 500,
    eventHeight: 20
  }

  constructor(props) {
    super(props);
    const { hi, lo, treeState } = this.getTreeState(props.children);

    this.state = {
      viewportOffset: 0,
      treeState,
      hi,
      lo,
      leftWidth: 150
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      const { hi, lo, treeState } = this.getTreeState(nextProps.children);
      this.setState({
        treeState,
        hi,
        lo
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
    const _start = this.props.start;
    const _end = this.props.end;
    let lo = _start || null;
    let hi = _end || null;

    const crawl = function crawl(children, treeState, parent) {
      const arr = React.Children.toArray(children);
      const len = arr.length;

      for (let i = 0; i < len; i++) {
        let child = arr[i];
        let { collapse, id, start, end, value, text, onClick } = child.props;

        if (_start === null) {
          lo = Math.min(lo, start);
        }

        if (_end === null) {
          hi = Math.max(hi, end);
        }

        let isParentCollapsed = parent && (parent.isCollapsed || parent.isParentCollapsed);
        let node = {
          isCollapsed: collapse,
          id,
          start,
          end,
          value,
          text,
          isParentCollapsed,
          children: [],
          onClick
        };

        treeState.push(node);

        if (parent) {
          parent.children.push(node);
        }

        crawl(child.props.children, treeState, node);
      }
    };

    const treeState = [];

    crawl(children, treeState, null);

    return { hi, lo, treeState };
  }

  toggleCollapse(id) {
    const state = this.state;
    const treeState = state.treeState;
    const index = treeState.findIndex(x => x.id === id);

    if (index !== -1) {
      const node = treeState[index];
      const props = this.props;

      node.isCollapsed = !node.isCollapsed;

      const collapse = (node) => {
        node.children.forEach(child => {
          child.isParentCollapsed = node.isCollapsed || node.isParentCollapsed;
          collapse(child);
        });
      };

      collapse(node);

      this.setState({
        treeState
      });
    }
  }

  getEvents() {
    const { hi, lo, treeState, viewportOffset, leftWidth } = this.state;
    const { width, height, eventHeight, start, end } = this.props;
    const displayCount = this.getDisplayCount(height, eventHeight);
    const startIndex = this.getStartIndex(viewportOffset, eventHeight);
    const len = treeState.length;
    const endIndex = startIndex + displayCount;
    const events = [];
    const toggleCollapse = ::this.toggleCollapse;
    let key = 0;
    const domain = [start || lo, end || hi];
    const range = [0, width];
    const scale = linearScale(domain, range);
    for (let i = 0, offset = 0; i < len; i++) {
      let node = treeState[i];
      if (node.isParentCollapsed) {
        offset += 1;
        continue;
      }
      const start = Math.max(0, (startIndex + offset - 4));
      const end = Math.min(len - 1, (endIndex + offset + 4));
      if (start <= i && i <= end) {
        events.push((<NfTimelineRenderedEvent
            key={key++}
            id={node.id}
            leftWidth={leftWidth}
            height={eventHeight}
            isCollapsed={node.isCollapsed}
            isParentCollapsed={node.isParentCollapsed}
            onToggleCollapse={toggleCollapse}
            start={node.start}
            end={node.end}
            value={node.value}
            onClick={node.onClick}
            scale={scale} />));
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
    const offset = (startIndex * eventHeight);
    return {
      transform: `translate3d(0, ${offset}px, 0)`
    };
  }

  viewportScrolled(e) {
    const viewportOffset = e.target.scrollTop;
    const { state: { treeState, leftWidth }, props: { height, eventHeight } } = this;
    this.setState({
      viewportOffset
    });
  }

  onTimelineMouseMove(e) {
    if (this.state.resizingLeft) {
      e.preventDefault();
      const leftWidth = (e.clientX - this.refs.timeline.offsetLeft);
      this.setState({
        leftWidth
      });
    }
  }

  getLeftSizeHandleStyle() {
    return {
      width: '20px',
      height: this.props.height + 'px',
      marginLeft: '-10px',
      position: 'absolute',
      top: 0,
      left: this.state.leftWidth + 'px',
      background: 'transparent',
      cursor: this.state.resizingLeft ? 'ew-resize' : 'col-resize'
    };
  }

  startLeftResize(e) {
    e.preventDefault();
    this.setState({
      resizingLeft: true
    });
  }

  stopLeftResize(e) {
    this.setState({
      resizingLeft: false
    });
  }

  render() {
    const { treeState } = this.state;
    const total = treeState.length;
    const events = this.getEvents();
    const contentStyle = this.getContentStyle(total);
    const viewportStyle = this.getViewportStyle();
    const offsetStyle = this.getOffsetStyle();
    const leftSizeHandleStyle = this.getLeftSizeHandleStyle();

    return (<div onMouseMove={::this.onTimelineMouseMove} ref="timeline" className="nf-timeline">
      <div onScroll={::this.viewportScrolled} className="nf-timeline-viewport" style={viewportStyle}>
        <div className="nf-timeline-content" style={contentStyle}>
          <div className="nf-timeline-inner-offset" style={offsetStyle}>
            {events}
          </div>
        </div>
      </div>
      <div className="nf-timeline-left-size-handle" style={leftSizeHandleStyle}
        onMouseDown={::this.startLeftResize} onMouseUp={::this.stopLeftResize}></div>
    </div>);
  }
}
