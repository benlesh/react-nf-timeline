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

  startIndex(flattenedChildren) {
    const { viewportHeight, viewportOffset } = this.state;
    const { eventHeight } = this.props;
    const diff = viewportHeight - viewportOffset;
    return Math.max(0, flattenedChildren.length - Math.floor((flattenedChildren.length * diff) / (flattenedChildren.length * eventHeight)) - 1) || 0;
  }

  get displayCount() {
    return Math.ceil(this.props.height / this.props.eventHeight) + 2;
  }

  componentWillUnmount() {
    const viewport = this.refs.viewport;
    viewport.removeEventListener('scroll', this.viewportScrolled);
  }

  flattenChildren() {
    if (!this._lastChildren || this._lastChildren !== this.props.children) {
      this._lastChildren = this.props.children;
      this._flattened = null;
    }

    if (!this._flattened) {
      const { children, eventHeight } = this.props;
      let key = 0;

      function flatten(children, level, flat) {
        const arr = React.Children.toArray(children);
        arr.forEach(child => {
          flat.push(React.cloneElement(child, {
            level: level,
            height: eventHeight
          }));
          flatten(child.props.children, level + 1, flat);
        });
        return flat;
      }

      this._flattened = flatten(children, 0, []);
    }

    return this._flattened;
  }

  render() {
    const { eventHeight } = this.props;
    const { viewportOffset } = this.state;
    const flattenedChildren = this.flattenChildren();
    const startIndex = this.startIndex(flattenedChildren);
    const displayCount = this.displayCount;
    const events = flattenedChildren.slice(startIndex, startIndex + displayCount)
      .map((event, i) => React.cloneElement(event, { key: i, viewportOffset }));

    const viewportStyle = {
      'height': this.props.height + 'px',
      'overflow-y': 'scroll'
    };

    const contentStyle = {
      'height': (eventHeight * flattenedChildren.length) + 'px'
    };

    return (<div className="nf-timeline">
      <div ref="viewport" className="nf-timeline-viewport" style={viewportStyle}>
        <div className="nf-timeline-content" style={contentStyle}>
          {events}
        </div>
      </div>
    </div>);
  }
}
