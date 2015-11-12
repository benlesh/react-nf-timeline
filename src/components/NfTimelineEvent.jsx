import React, { Component, PropTypes } from 'react';

let test = 0;

export default class NfTimelineEvent extends Component {
  static propTypes = {
    level: PropTypes.number,
    viewportOffset: PropTypes.number,
    eventHeight: PropTypes.number,
    value: PropTypes.string
  }

  static defaultProps = {
    level: 0,
    viewportOffset: 0
  }

  constructor(props) {
    super(props);
    this.state = {
      collapse: false
    };
    this.test = test++;
  }

  componentDidMount() {
    this._collapseHandler = () => {
      this.setState({
        collapse: !this.state.collapse
      });
    };

    this.refs.collapseButton.addEventListener('click', this._collapseHandler);
  }

  componentWillUnmount() {
    this.refs.collapseButton.removeEventListener('click', this._collapseHandler);
  }

  render() {
    const { eventHeight, level } = this.props;
    const style = {
      marginLeft: '10px',
    };

    return (<div className="nf-timeline-event" style={style}>event {this.props.value} <button ref="collapseButton">collapse</button>
        <div className="nf-timeline-event-children">
          {this.props.children}
        </div>
      </div>);
  }
}
