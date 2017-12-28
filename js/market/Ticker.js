'use strict'

let MarketStore = require('./MarketStore');

MarketStore.addTickerPriceListener(() => {
  let {last, high, low, buy, sell, vol} = MarketStore.getTickerPrice();
  $('#last-price').html(last);
  $('#high-price').html(high);
  $('#low-price').html(low);
  $('#buy-price').html(buy);
  $('#sell-price').html(sell);
  $('#vol-price').html(vol);
})
