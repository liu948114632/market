"use strict";

let React = require('react');

/**
  最近5笔已成交
*/
let DealLog = React.createClass({
  renderRow(data) {
    let cls = data[0] == '0' ? 'c_red' : 'c_green';
    let type = data[0] == '0' ? '买入' : '卖出';
    return (
      <p className={cls} key={data.join('-')}>
        <span className="db dc1 fl">{type}</span>
        <span className="db dc2 fl">{(data[1] * 1).toFixed(4)}</span>
        <span className="db dc3 fl">{(data[2] * 1).toFixed(4)}</span>
        <span className="db dc4 fl">{(data[5]).toFixed(2)}</span>
        <span className="db dc5 fl"><a href="javascript:void(0)" className="c_gray">已成交</a></span>
      </p>
    )
  },
  _more() {
    let {isLogin, symbol} = this.props;
    if (1 === isLogin) {
      location.href = `/account/entrusts.html?symbol=${symbol}&status=3&type=-1`;
    }
  },
  render() {
    var items = this.props.entrustListLog.map(this.renderRow);
    return (
      <div>
        <div className="title" onClick={this._more}>
          <h4 className="pl10 fl f14">最近5笔已成交</h4>
          <i className="db fr iconfont">&#xe60c;</i>
        </div>
        <p>
          <span className="db dt1 fl">委托类别</span>
          <span className="db dt2 fl">委托单价</span>
          <span className="db dt3 fl">数量</span>
          <span className="db dt4 fl">总价</span>
          <span className="db dt5 fl">状态</span>
        </p>
        {items}
      </div>
    )
  }
})

module.exports = DealLog;
