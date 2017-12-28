"use strict";

let React = require('react');

/**
  成交历史
*/
let EntrustLog = React.createClass({
    renderRow(data, i) {
        let cls = data[3] == '1' ? 'c_red' : 'c_green';
        let type = data[3] == '1' ? '买入' : '卖出';
        return (
            <p key={i + data.join('-')}>
                <span className="db lc1 fl">{data[2]}</span>
                <span className={`db lc2 fl ${cls}`}>{type}</span>
                <span className={`db lc3 fl ${cls}`}>{(data[0] * 1).toFixed(4)}</span>
                <span className="db lc4 fl">{(data[1] * 1).toFixed(4)}</span>
                <span className="db lc5 fl">{(data[0] * data[1]).toFixed(2)}</span>
            </p>
        )
    },
    render() {
        let items = this.props.recentDealList.map(this.renderRow);
        return <div>{items}</div>
    }
})

module.exports = EntrustLog;
