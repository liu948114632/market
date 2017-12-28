'use strict'

var EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');

let mockJquery = function(){
  return {change: function(){}}
}

mockJquery.getJSON = function(){}

let $ = window.$ || mockJquery;

let vtype = window.vtype || {symbol: 0, fname: '', fname_sn: ''};
let symbol = vtype.symbol;    // 币Id

let marketData = {buyDepthList:[],recentDealList:[],sellDepthList:[]};
let tickerPrice = {};
let userData = assign({"sellFee": 0,"isLogin":0,"rmbfrozen":0,"rmbtotal":0,"entrustList":[],"virfrozen":0,"needTradePasswd":true,"entrustListLog":[],"virtotal":0,"recommendPrizesell":0,"recommendPrizebuy":0}, vtype);
let buyPrice = 0;
let sellPrice = 0;
let deep = 4;

const DEEP_CHANGE_EVENT = "deep_event";
const USER_DATA_CHANGE_EVENT = 'user_event';
const MARKET_DATA_CHANGE_EVENT = 'market_event';
const BUY_PRICE_CHANGE_EVENT = 'buy_event';
const SELL_PRICE_CHANGE_EVENT = 'sell_event';
const TICKER_PRICE_CHANGE_EVENT = 'ticker_price';

// 主要的几个获取数据的ajax接口
let refreshMarket = (callback) => {
    $.getJSON('/market/marketRefresh', {symbol: symbol, t: new Date().getTime(), deep: deep}, function(data){
        MarketStore.setMarketData(data);
        callback && callback();
    })
}

let refreshUserInfo = (callback) => {
    $.getJSON('/market/refreshUserInfo', {symbol: symbol, t: new Date().getTime()}, data => {
        MarketStore.setUserData(assign(data, vtype));
        callback && callback(data);
    });
}

let refreshTicker = (callback) => {
    $.getJSON('/market/real', {symbol: symbol, t: new Date().getTime()}, data => {
        MarketStore.setTickerPrice(assign(data, vtype));
        callback && callback();
    });
}

let refreshFee = (callback) => {
    $.getJSON('/market/getFee', {symbol: symbol, t: new Date().getTime()}, data => {
        MarketStore.setTickerPrice(assign(userData, vtype, {sellFee: data.fee}));
        callback && callback();
    });
}

let MarketStore = assign({}, EventEmitter.prototype, {
  // user
  getUserData() {
		return userData;
	},
  setUserData(data) {
		userData = data;
    this.emit(USER_DATA_CHANGE_EVENT)
	},
	addUserListener(callback) {
		this.on(USER_DATA_CHANGE_EVENT, callback)
	},
  removeUserListener(callback) {
		this.removeListener(USER_DATA_CHANGE_EVENT, callback);
	},
  // market
  getSymbol() {
    return symbol;
  },
  getDeep() {
    return deep;
  },
  setDeep(data) {
    deep = data;
    this.emit(DEEP_CHANGE_EVENT)
  },
  addDeepListener(callback) {
		this.on(DEEP_CHANGE_EVENT, callback)
	},
  getMarketData() {
		return marketData;
	},
  setMarketData(data) {
    marketData = data;
    this.emit(MARKET_DATA_CHANGE_EVENT)
	},
	addMarketListener(callback) {
		this.on(MARKET_DATA_CHANGE_EVENT, callback)
	},
	removeMarketListener(callback) {
		this.removeListener(MARKET_DATA_CHANGE_EVENT, callback);
	},
  // buy price
  setBuyPrice(price) {
    buyPrice = price;
    this.emit(BUY_PRICE_CHANGE_EVENT);
  },
  getBuyPrice(price) {
    return buyPrice;
  },
  addBuyPriceListener(callback) {
    this.on(BUY_PRICE_CHANGE_EVENT, callback)
  },
  removeBuyPriceListener(callback) {
    this.removeListener(BUY_PRICE_CHANGE_EVENT, callback)
  },
  // sell price
  setSellPrice(price) {
    sellPrice = price;
    this.emit(SELL_PRICE_CHANGE_EVENT);
  },
  getSellPrice(price) {
    return sellPrice;
  },
	addSellPriceListener(callback) {
		this.on(SELL_PRICE_CHANGE_EVENT, callback);
	},
	removeSellPriceListener(callback) {
		this.removeListener(SELL_PRICE_CHANGE_EVENT, callback);
	},
  // ticker price
  setTickerPrice(price) {
    tickerPrice = price;
    this.emit(TICKER_PRICE_CHANGE_EVENT);
  },
  getTickerPrice(price) {
    return tickerPrice;
  },
	addTickerPriceListener(callback) {
		this.on(TICKER_PRICE_CHANGE_EVENT, callback);
	},
	removeTickerPriceListener(callback) {
		this.removeListener(TICKER_PRICE_CHANGE_EVENT, callback);
	},

    refreshUserInfo() {
        refreshUserInfo();
    }
})

module.exports = MarketStore;

// 不断刷新Store的数据，页面会自动更新，刷新的方式可以改成Socket.io，即服务器推送

$('#deep_select_area').change(function(){
  MarketStore.setDeep(this.value);
  refreshMarket();
});

let _refreshMarket = refreshMarket.bind(null, () => {setTimeout(_refreshMarket, 1000)});
let _refreshUserInfo = refreshUserInfo.bind(null, () => {setTimeout(_refreshUserInfo, 10000)});
let _refreshTicker = refreshTicker.bind(null, () => {setTimeout(_refreshTicker, 1000)});

let ws = require('./ws');

let connect = (data) => {
    if (ws.supported()) {
        _refreshUserInfo();
        ws.connect(data.token);
    } else {
        _refreshMarket() | _refreshUserInfo() | _refreshTicker();
    }
}

refreshFee() | refreshMarket() | refreshUserInfo(connect);

 // _refreshUserInfo();

// _refreshMarket() | _refreshUserInfo() | _refreshTicker();

// refreshMarket() | refreshUserInfo() | refreshTicker();



