"use strict";

var EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');

let ws;

exports.support = () => {
  return window.WebSocket !== undefined;
}

exports.onData = (eventName, callback) {
  WsEvent.on(eventName, callback);
}

exports.connect() => {
  connect();
}

let WsEvent = assign({}, EventEmitter.prototype, {

})

let connect = function() {
  var url = `ws://${document.location.host}/ws/market`;
  ws = new WebSocket(url);
  ws.onopen = function(e){
    console.log("ws connect Success!");
  }
  ws.onclose = function(e) {
    // 连接断掉之后，等待3秒重试
    setTimeout(function(){
      ws = connect()
    }, 3000)
  }
  ws.onmessage = function(evt){
    let data = evt.data;
    console.log("ws get:"+data);
  }
}

// 如果浏览器支持websocket，优先使用websocket
// if (window.WebSocket) {

//
//   var ws = connect();
//
//   return;
// }
