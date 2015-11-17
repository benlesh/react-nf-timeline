import React, { Component, PropTypes } from 'react';

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
    this.state = {
      viewportOffset: 0
    };
    this._lastScrollTop = 0;
  }

  componentDidMount() {
    const viewport = this.refs.viewport;
    const { eventHeight } = this.props;
    const viewportScrolled = this.viewportScrolled = (e) => {
      this._lastScrollTop = e.target.scrollTop;
      this.setState({
        viewportOffset: e.target.scrollTop,
        viewportHeight: e.target.scrollHeight
      });
    };

    viewport.addEventListener('scroll', viewportScrolled);
  }

  get startIndex() {
    return Math.max(Math.floor(this.state.viewportOffset / this.props.eventHeight) - 1, 0);
  }

  get displayCount() {
    return Math.ceil(this.props.height / this.props.eventHeight) + 2;
  }

  componentWillUnmount() {
    const viewport = this.refs.viewport;
    viewport.removeEventListener('scroll', this.viewportScrolled);
  }

  get treeState() {
    const children = this.props.children;

    if (!this._treeState || children !== this.lastChildren) {
      this.lastChildren = children;
      const crawl = function crawl(children, treeState, parent) {
        const arr = React.Children.toArray(children);
        const len = arr.length;
        for (let i = 0; i < len; i++) {
          let child = arr[i];
          let node = {};

          node.isCollapsed = child.props.collapse;
          node.children = [];
          node.id = child.props.id;
          node.parent = parent;
          node.element = child;

          treeState.push(node);

          if (parent) {
            parent.children.push(node);
          }

          crawl(child.props.children, treeState, node);
        }
      };

      const treeState = [];

      crawl(children, treeState, null);

      this._treeState = treeState;
    }

    return this._treeState;
  }

  processChildren() {
    const { treeState, displayCount, startIndex } = this;
    const total = treeState.length;
    const endIndex = startIndex + displayCount;
    const events = [];

    for (let i = 0; i < total; i++) {
      let node = treeState[i];
      if (startIndex <= i && i <= endIndex) {
        events.push((<div key={events.length}>Event {node.id}</div>));
      }
    }

    return { events, total };
  }

  viewportStyle() {
    return {
      height: this.props.height + 'px',
      overflowY: 'scroll'
    };
  }

  contentStyle(total) {
    return {
      height: (this.props.eventHeight * total) + 'px'
    };
  }

  offsetStyle() {
    const { startIndex, props: { eventHeight } } = this;
    const offset = startIndex * eventHeight;
    return {
      transform: `translate3d(0, ${offset}px, 0)`
    };
  }

  render() {
    const { viewportOffset } = this.state;
    const { displayCount, startIndex } = this;
    const { events, total } = this.processChildren();
    const viewportStyle = this.viewportStyle();
    const contentStyle = this.contentStyle(total);
    const offsetStyle = this.offsetStyle();

    return (<div className="nf-timeline">
      <div ref="viewport" className="nf-timeline-viewport" style={viewportStyle}>
        <div className="nf-timeline-content" style={contentStyle}>
          <div className="nf-timeline-inner-offset" style={offsetStyle}>
            {events}
          </div>
        </div>
      </div>
    </div>);
  }
}
