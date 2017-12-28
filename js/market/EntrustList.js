"use strict";

let React = require('react');
let MarketStore = require('./MarketStore');

/**
  委托记录
*/
let EntrustList = React.createClass({
  renderRow(index, data, type) {
    let depp = MarketStore.getDeep();
    let cls = this.props.cls;
    return (
        <p onClick={this.props.onClick.bind(null, data)} key={index + data.join('-')}>
            <span className={`c1 db fl ${cls}`}>{type}({index + 1})</span>
            <span className={`c2 db fl ${cls}`}>{(data[0] * 1).toFixed(depp)}</span>
            <span className="c3 db fl">{(data[1] * 1).toFixed(4)}</span>
            <span className="c4 db fl">{(data[2] * 1).toFixed(0)}</span>
        </p>
    )
  },
  render() {
      let {list, type} = this.props;
      let items = list.map((data, i) => {
          return this.renderRow(i, data, type);
      })
      return <div>{items}</div>;
  }
})

module.exports = EntrustList;
