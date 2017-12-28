'use strict'

let React = require('react');
let MarketStore = require('./MarketStore');
let EntrustList = require('./EntrustList');

let BuyEntrustList = React.createClass({
  render() {
    let list = this.props.buyDepthList;
    return (
      <EntrustList list={list} type="买" cls="c_red" onClick={(data) => {
        MarketStore.setSellPrice(data[0]);
      }}/>
    )
  }
})

module.exports = BuyEntrustList;
