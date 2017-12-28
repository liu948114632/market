'use strict'

// let io = require('socket.io')

let io;
let assign = require('object-assign');

let MarketStore = require('./MarketStore');

let symbol = MarketStore.getSymbol();

let socket;

let connect = (token) => {
    if (socket && socket.connected) {
        socket.close();
    }
    let deep = MarketStore.getDeep();
    let protocol;
    let host;
    if (process.env.NODE_ENV === 'production') {
        protocol = 'wss';
        host = 'www.zhgtrade.com'
    } else {
        protocol = 'ws';
        host = document.domain;
    }
    socket = io(`${protocol}://${host}:9092/trade?symbol=${symbol}&deep=${deep}&token=${token}`, {transports: ['websocket', 'pull']});
    socket.on('entrust-buy', function (msg) {
        let data = MarketStore.getMarketData() || {};
        MarketStore.setMarketData(assign(data, {buyDepthList: eval(msg)}))
    });
    socket.on('entrust-sell', function (msg) {
        let data = MarketStore.getMarketData() || {};
        MarketStore.setMarketData(assign(data, {sellDepthList: eval(msg)}))
    });
    socket.on('entrust-log', function (msg) {
        let data = MarketStore.getMarketData() || {};
        MarketStore.setMarketData(assign(data, {recentDealList: eval(msg)}))
    });
    socket.on('real', function (msg) {
        MarketStore.setTickerPrice(eval("(" + msg + ")"));
    });
    socket.on('entrust-update', function (msg) {
        let newData = eval("(" + msg + ")");
        let oldData = MarketStore.getUserData();
        if (oldData.symbol == newData.symbol) {
            MarketStore.setUserData(assign(oldData, newData));
        } else {
            MarketStore.setUserData(assign(oldData, {rmbfrozen: newData.rmbfrozen, rmbtotal: newData.rmbtotal}));
        }
    });
}

exports.supported = () => {
    return true;
}

exports.connect = (token) => {
    // MarketStore.addDeepListener(connect);
    // connect();

    // AMD
    require.ensure([], () => {
        // Highcharts = require('./highstock');
        io = require('socket.io');
        connect = connect.bind(null, token)
        MarketStore.addDeepListener(connect);
        connect();
    })


    // console.log(evt);
    // 40/trade-1-4
    // ws://127.0.0.1:9092/socket.io/?EIO=3&transport=websocket
//   let deep = MarketStore.getDeep();
// let wsUri = "ws://127.0.0.1:9092/socket.io/?EIO=3&transport=websocket"
//   let ws = new WebSocket(wsUri);
//         ws.onopen = function(evt) {
//             // onOpen(evt)
//             console.log('open', evt);
//               ws.send(`40/trade-${symbol}-${deep}`)
//         };
//         ws.onclose = function(evt) {
//             // onClose(evt)
//             console.log('close', evt);
//         };
//         ws.onmessage = function(evt) {
//             // onMessage(evt)
//             console.log('msg', evt);
//             if (evt.data == '40') {
//
//             }
//         };
//         ws.onerror = function(evt) {
//           console.log('err', evt);
//             // onError(evt)
//         };
};
