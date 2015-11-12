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

  get startPoint() {
    return Math.max(Math.floor(this.state.viewportOffset / this.props.eventHeight) - 1, 0);
  }

  get displayCount() {
    return Math.ceil(this.props.height / this.props.eventHeight) + 2;
  }

  componentWillUnmount() {
    const viewport = this.refs.viewport;
    viewport.removeEventListener('scroll', this.viewportScrolled);
  }

  crawlExpandedChildren(action) {
    let index = 0;

    const crawl = (children, level, _rootParent) => {
      const arr = React.Children.toArray(children);
      for (let i = 0, len = arr.length; i < len; i++) {
        const child = arr[i];
        // if the node is collapsed, don't count it
        // and don't crawl the branch
        if (child.props.collapse) {
          continue;
        }


        index++;

        let e = {
          child,
          index,
          level,
          rootParent: _rootParent || child
        };

        action(e);

        crawl(child.props.children, level + 1, _rootParent || child);
      }
    };

    crawl(this.props.children, 0, null);
  }

  processChildren() {
    const { startPoint, displayCount,
      props: { eventHeight },
      state: { viewportOffset = 0 } } = this;
    const rootParents = [];
    let total = 0;

    this.crawlExpandedChildren(e => {
      total++;
      const { index, rootParent, level } = e;

      if (startPoint - 1 <= index && index <= startPoint + displayCount + 1) {
        if (rootParents.indexOf(rootParent) === -1) {
          rootParents.push(rootParent);
        }
      }
    });

    const events = rootParents.map((element, i) => React.cloneElement(element, { key: i }));
    return { events, total };
  }

  render() {
    const { eventHeight } = this.props;
    const { viewportOffset } = this.state;
    const { displayCount, startPoint } = this;
    const { events, total } = this.processChildren();

    const viewportStyle = {
      height: this.props.height + 'px',
      overflowY: 'scroll'
    };

    const contentStyle = {
      'height': (eventHeight * total) + 'px'
    };

    const offsetStyle = {
      transform: `translate3d(0, ${viewportOffset}px, 0)`
    };

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
