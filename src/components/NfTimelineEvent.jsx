import React, { Component, PropTypes } from 'react';

let test = 0;

export default class NfTimelineEvent extends Component {
  static propTypes = {
    level: PropTypes.number,
    viewportOffset: PropTypes.number,
    eventHeight: PropTypes.number,
    value: PropTypes.any,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    id: PropTypes.string
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
    return (<div>{this.props.children}</div>);
  }
}
