"use strict";

let React = require('react');
let MarketStore = require("./MarketStore")

/**
  最近5笔未成交
*/
let NotDeal = React.createClass({
  _cancel(id) {
    $.post('/market/cancelEntrust', {id: id}, (res) => {
        MarketStore.refreshUserInfo();
    })
  },
  _more() {
    let {isLogin, symbol} = this.props;
    if (1 === isLogin) {
      location.href = `/account/entrusts.html?symbol=${symbol}&status=1&type=-1`;
    }
  },
  renderRow(data) {
    let cls = data[0] == '0' ? 'c_red' : 'c_green';
    let type = data[0] == '0' ? '买入' : '卖出';
    return (
      <p className={cls} key={data.join('-')}>
        <span className="db nc1 fl">{type}</span>
        <span className="db nc2 fl">{(data[1] * 1).toFixed(4)}</span>
        <span className="db nc3 fl">{(data[2] * 1).toFixed(4)}</span>
        <span className="db nc4 fl">{(data[1] * data[2]).toFixed(2)}</span>
        <span className="db nc5 fl"><a href="javascript:void(0) " className="c_orange" onClick={this._cancel.bind(null, data[3])}>取消挂单</a></span>
      </p>
    )
  },
  render() {
    var items = this.props.entrustList.map(this.renderRow);
    return (
      <div>
        <div className="title" onClick={this._more}>
          <h4 className="pl10 fl f14">最近5笔未成交</h4>
          <i className="db fr iconfont">&#xe60c;</i>
        </div>
        <p>
          <span className="db nt1 fl">委托类别</span>
          <span className="db nt2 fl">委托单价</span>
          <span className="db nt3 fl">数量</span>
          <span className="db nt4 fl">总价</span>
          <span className="db nt5 fl">操作</span>
        </p>
        {items}
      </div>
    )
  }
})

module.exports = NotDeal;
