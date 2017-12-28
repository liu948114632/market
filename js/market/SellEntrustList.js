'use strict'

let React = require('react');
let MarketStore = require('./MarketStore');
let EntrustList = require('./EntrustList');

let SellEntrustList = React.createClass({
  render() {
    let list = this.props.sellDepthList;
    return (
      <EntrustList list={list} type="卖" cls="c_green" onClick={(data) => {
        MarketStore.setBuyPrice(data[0]);
      }}/>
    )
  }
})
module.exports = SellEntrustList;
