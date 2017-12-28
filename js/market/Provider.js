'use strict'

let React = require('react');

let Provider = React.createClass({
  exec(method, args) {
    return this.props.store[method](args);
  },
  getInitialState() {
    return this.getData();
  },
  componentDidMount() {
    this.exec(`add${this.props.eventName}Listener`, this.updateData);
  },
  componentWillUnmount() {
    this.exec(`remove${this.props.eventName}Listener`, this.updateData);
  },
  getData() {
    return this.exec(`get${this.props.eventName}Data`);
  },
  updateData() {
    this.setState(this.getData());
  },
  render() {
    return <this.props.component {...this.state}/>;
  }
})

module.exports = Provider;
