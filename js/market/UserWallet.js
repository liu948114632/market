"use strict";

let React = require('react');

let UserWallet = React.createClass({
  render() {
    let {virtotal, rmbtotal, virfrozen, rmbfrozen, fname, symbol} = this.props;
    return (
      <div>
					<p className="fir">
						<span className="db fl fir right_line">可用人民币</span>
						<span className="db fl c_green right_line">{`${rmbtotal.toFixed(4)}`}<a href="/account/chargermb.html" className="db fr c_orange pr5">充值</a></span>
						<span className="db fl fir right_line">冻结人民币</span>
						<span className="db fl c_red">{`${rmbfrozen.toFixed(4)}`}</span>
					</p>
					<p>
						<span className="db fl fir right_line ellipsis" title={`可用${fname}`}>{`可用${fname}`}</span>
						<span className="db fl right_line c_green">{`${virtotal.toFixed(4)}`}<a href={`/account/chargeBtc.html?symbol=${symbol}`} className="db fr c_orange pr5">充值</a></span>
						<span className="db fl right_line fir ellipsis" title={`冻结${fname}`}>{`冻结${fname}`}</span>
						<span className="db fl c_red">{`${virfrozen.toFixed(4)}`}</span>
					</p>
        </div>
    )
  }
})

module.exports = UserWallet;
