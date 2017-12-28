"use strict";

let React = require('react');
let ReactDom = require('react-dom');

let MarketStore = require('./MarketStore');

let {BuyContent, SellContent} = require('./BuySell');
let EntrustList = require('./EntrustList');
let EntrustLog = require('./EntrustLog');
let UserWallet = require('./UserWallet');
let NotDeal = require('./NotDeal');
let DealLog = require('./DealLog');
let tab = require('./tab');
let Provider = require('./Provider');
let BuyEntrustList = require('./BuyEntrustList');
let SellEntrustList = require('./SellEntrustList');
let Ticker = require('./Ticker');

// 已成交
ReactDom.render(<Provider component={DealLog} store={MarketStore} eventName="User"/>, document.getElementById('deal-log'))
// 未成交
ReactDom.render(<Provider component={NotDeal} store={MarketStore} eventName="User"/>, document.getElementById('not-deal'))
// 钱包
ReactDom.render(<Provider component={UserWallet} store={MarketStore} eventName="User"/>, document.getElementById('user-wallet'))
// 买入
ReactDom.render(<Provider component={BuyContent} store={MarketStore} eventName="User"/>, document.getElementById('buy-content'))
// 卖出
ReactDom.render(<Provider component={SellContent} store={MarketStore} eventName="User"/>, document.getElementById('sell-content'))

// 买单委托列表
ReactDom.render(<Provider component={BuyEntrustList} store={MarketStore} eventName="Market"/>, document.getElementById('buyList'))
// 卖单委托列表
ReactDom.render(<Provider component={SellEntrustList} store={MarketStore} eventName="Market"/>, document.getElementById('sellList'))
// 成交日志
ReactDom.render(<Provider component={EntrustLog} store={MarketStore} eventName="Market"/>, document.getElementById('logList'))

tab.init();
