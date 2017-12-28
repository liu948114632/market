"use strict";

let React = require('react');

let {initBuySlider, initSellSlider} = require('./jq-slider');

let MarketStore = require('./MarketStore');

let symbol = MarketStore.getUserData().symbol;    // 币Id

let BTN_TEXT1 = ['买入', '正在买入...'];
let BTN_TEXT2 = ['卖出', '正在卖出...'];
let WARN_TEXT = {
    '-1': '最小交易数量为：0.0001',
    '-2': '交易密码不正确！',
    '-3': '出价不能为0！',
    '-4': '余额不足！',
    '-5': '您未设置交易密码，请到<font color="red"><a href="/user/security.html">这里</a></font>设置交易密码。',
    '-6': '您输入的价格与最新成交价相差太大，请检查是否输错！',
    '-8': '请输入交易密码！',
    '-100': '该币种不存在！',
    '-101': '暂停交易！',
    '-400': '不在交易时间！',
    '-50': '交易密码不能为空！',
    '-200': '网络超时！',
    '-900': '交易价格超出限定范围！',
    '-111': '最小总额不能少于10！',
    '-112': '买入金额过小！',
    '-113': '卖出数量不能少于0.01！',
    '-35':'单笔交易金额不能超过5万！',
    '-19':'交易价格与推荐价格差异较大，请谨慎交易！',
}

let updateNeedPassword = () => {
    let userData = MarketStore.getUserData();
    userData.needTradePasswd = false;
    MarketStore.setUserData(userData);
}

let HANDLER_INPUT_PRICE_COUNT = function (e,recommendPrize) {
    let {name, value} = e.target;
    if(recommendPrize){
        if(value!="" && (value>recommendPrize*1.5||value<recommendPrize*0.5)){
            this.state.warnText = WARN_TEXT[-19];
        }else{
            this.state.warnText = "";
        }
    }
    if (!isNaN(value)) {

        value = value.replace(/\s+|\s+/g, '');  // 去掉前后空格
        if (value.length > 1 && value.indexOf('.') == -1) {
            value = value.replace(/^0/g, '');    // 去掉非小数前面的0
        }
        if (value < 0) {
            return;
        }
        let validNum = value.match(/\S+[.]\d{4}/);
        if (validNum) {
            value = validNum[0];
        }

        if (name == 'price' && this.state.count * 1 > this.getMaxCount(value) * 1) {
            this.state.count = this.getMaxCount(value);
        }
        if (name == 'count' && value * 1 > this.state.maxCount * 1) {
            value = this.state.maxCount;
        }
        this.state[name] = value;
        let {price, count} = this.state;
        this.state.money = price * count;
        this.setState({});
    }
}

let jumpToLogin = () => {
    $('#login').click();
}

let CHECK_USER_STATE = function () {
    if (this.props.isLogin === 0) {
        this.setState({warnText: '请先登录'})
        jumpToLogin();
        return false;
    }
    if (this.state.count < 0.0001) {
        this.setState({warnText: WARN_TEXT[-1]})
        return false;
    }
    if (this.state.count * this.state.price < 10) {
        this.setState({warnText: WARN_TEXT[-111]})
        return false;
    }
    if (this.props.needTradePasswd !== false && this.refs.pwd.value.length == 0) {
        this.setState({warnText: WARN_TEXT[-8]})
        return false;
    }
    return true;
}

/**
 买入
 */
let BuyContent = React.createClass({
    changed: false,
    posting: false,
    getInitialState() {
        let maxCount = (this.props.rmbtotal / this.props.recommendPrizebuy).toFixed(4);
        return {
            price: this.props.recommendPrizebuy,
            maxCount: maxCount,
            count: 0,
            money: 0,
            warnText: '',
            btnText: BTN_TEXT1[0]
        }
    },
    getMaxCount(price) {
        return (this.props.rmbtotal / price).toFixed(4);
    },
    componentWillReceiveProps(props) {
        let maxCount = (props.rmbtotal / this.state.price).toFixed(4);
        if (maxCount == 0) {
            maxCount = '0'
        }
        this.state.maxCount = maxCount;
    },
    _changeCount(percent) {
        let {recommendPrizebuy, rmbtotal} = this.props;
        let {price} = this.state;
        let count = rmbtotal / price * (percent / 100);
        count = count.toFixed(4);
        if (count == 0 || price == 0 || rmbtotal == 0) {
            count = '0';
        }
        this._onChange({target: {name: 'count', value: count}});
    },
    _setSlider(count) {
        let percent = count / (this.props.rmbtotal / this.state.price) * 100;
        if (!isNaN(percent)) {
            this.ScrollBar.setPercent(percent.toFixed(0));
        } else if (this.props.virtotal == 0) {
            this.ScrollBar.setPercent(0.0.toFixed(0));
        }
    },
    _toMaxCount() {
        this._changeCount(100);
        this._setSlider(this.state.maxCount);
    },
    componentDidMount() {
        this.ScrollBar = initBuySlider(this._changeCount);
        MarketStore.addBuyPriceListener(this._onPriceUpdate);
    },
    _onPriceUpdate() {
        this.setPrice(MarketStore.getBuyPrice());
    },
    shouldComponentUpdate(nextProps) {
        let props = this.props;
        if (!this.changed && props.recommendPrizebuy != nextProps.recommendPrizebuy) {
            this.setPrice(nextProps.recommendPrizebuy)
        }
        return true;
    },
    setPrice: function (price) {
        this._onChange({target: {name: 'price', value: price + ''}})
    },
    _handlerInput(e,recommendPrize) {
        this.changed = true;
        this._onChange(e,recommendPrize);
        this._setSlider(this.state.count);
    },
    _onChange: HANDLER_INPUT_PRICE_COUNT,
    _check: CHECK_USER_STATE,
    _buy() {
        if (this._check() && !this.posting) {
            this.posting = true;
            this.setState({btnText: BTN_TEXT1[1], warnText: ''});
            let {price, count} = this.state;
            if ((price*count*1).toFixed(4)>50000){
                this.setState({warnText: WARN_TEXT[-35]});
                this.posting = false;
                this.setState({btnText: BTN_TEXT1[0]});
                return;
            }
            let pwd = this.refs.pwd.value;
            $.post('/market/buyBtcSubmit', {
                tradeAmount: count,
                tradeCnyPrice: price,
                tradePwd: pwd,
                symbol: symbol
            }, (res) => {
                MarketStore.refreshUserInfo();
                this.setState({btnText: BTN_TEXT1[0]});
                this.posting = false;
                if (res.resultCode === 0) {
                    this._setSlider(0);
                    this.changed = false;
                    this.setState({count: 0, money: 0});
                    updateNeedPassword();
                } else {
                    let warntext = WARN_TEXT[res.resultCode];
                    const TRADE_AMOUNT_SMALL = -112;
                    if (TRADE_AMOUNT_SMALL === res.resultCode) {
                        warntext = res.resultMsg;
                    }
                    this.setState({warnText: warntext})
                    // this.setState({warnText: WARN_TEXT[res.resultCode]})
                }
            }, 'json');
        }
    },
    render() {
        let {recommendPrizebuy, rmbtotal, sname} = this.props;
        let {price, count, money} = this.state;
        if (!rmbtotal) {
            rmbtotal = 0;
        }
        return (
            <div>
                <div className="f20 title c_red pl20">{`买入${sname}`}</div>
                <div className="content">
                    <p style={{marginTop: 0}}>
                        <span className="db fl fir">最佳买价：</span>
                        <span className="db fl f14 c_red"
                              onClick={this.setPrice.bind(null, recommendPrizebuy)}>{recommendPrizebuy}</span>
                        <span className="db fl pl10"></span>
                    </p>
                    <p style={{marginTop: 0}}>
                        <span className="db fl fir">最大可买：</span>
                        <b className="db fl"
                           onClick={this._toMaxCount}>{(rmbtotal / (recommendPrizebuy || 1)).toFixed(4)}</b>
                        <span className="db fl pl10"></span>
                    </p>
                    <p style={{marginTop: 0}}>
                        <span className="db fl fir">买入比例：</span>
                        <span className="db fl Demo">
                      <span className="Main clear db fl">
                        <span className="db fl scrollBar">
                          <span className="db fl scroll_Track" style={{width: "58.2px"}}></span>
                          <span className="db fl scroll_Thumb" style={{marginLeft: "56.2px"}}></span>
                        </span>
                        <span className="fl db pl10 scrollBarTxt">0%</span>
                      </span>
                    </span>
                    </p>
                    <p>
                        <span className="db fl fir">买入价格：</span>
                        <input className="db fl" name="price" value={price} onChange={(e)=>this._handlerInput(e,recommendPrizebuy)}
                               autoComplete="off"/>
                    </p>
                    <p>
                        <span className="db fl fir">买入数量：</span>
                        <input className="db fl" name="count" value={count} onChange={this._handlerInput}
                               autoComplete="off"/>
                    </p>
                    <p>
                        <span className="db fl fir">手续费：</span>
                        <b className="db fl">{'0.0000'}</b>
                        <span className="db fl pl10">{`(0.0% ${sname})`}</span>
                    </p>
                    <p style={{marginTop: 0}}>
                        <span className="db fl fir">总价：</span>
                        <b className="db fl">{money.toFixed(4)}</b>
                        <b className="db fl pl10">CNY</b>
                    </p>

                    <p style={{'display': this.props.needTradePasswd === false ? 'none' : 'block'}}>
                        <span className="db fl fir">交易密码：</span>
                        <input className="db fl" type="text" ref="pwd" onFocus={() => {
                            this.refs.pwd.type = 'password'
                        }}/>
                        <a href="/account/security.html" className="db fl pl10 c_blue">忘记密码？</a>
                    </p>

                    <p className="tac c_red" dangerouslySetInnerHTML={{__html: this.state.warnText}}></p>
                    <a href="javascript:void(0)" className="confirm bg_red c_white tac f16"
                       onClick={this._buy}>{this.state.btnText}</a>
                </div>
            </div>
        )
    }
})

/**
 卖出
 */
let SellContent = React.createClass({
    changed: false,
    posting: false,
    getInitialState() {
        let maxCount = (this.props.virtotal).toFixed(4);
        return {
            price: this.props.recommendPrizesell,
            count: 0,
            money: 0,
            maxCount: maxCount,
            warnText: '',
            btnText: BTN_TEXT2[0]
        }
    },
    getMaxCount() {
        let maxCount = (this.props.virtotal).toFixed(4)
        if (maxCount == 0) {
            maxCount = '0'
        }
        return maxCount;
    },
    componentWillReceiveProps(props) {
        let maxCount = (props.virtotal).toFixed(4);
        if (maxCount == 0) {
            maxCount = '0'
        }
        this.state.maxCount = maxCount;
    },
    shouldComponentUpdate(nextProps) {
        let props = this.props;
        if (!this.changed && props.recommendPrizesell != nextProps.recommendPrizesell) {
            this.setPrice(nextProps.recommendPrizesell)
        }
        return true;
    },
    _setSlider(count) {
        let percent = count / (this.props.virtotal) * 100;
        if (!isNaN(percent)) {
            this.ScrollBar.value = percent.toFixed(0);
            this.ScrollBar.Initialize();
        } else if (this.props.virtotal == 0) {
            this.ScrollBar.value = 0.0.toFixed(0);
            this.ScrollBar.Initialize();
        }
    },
    _changeCount(percent) {
        let count = this.props.virtotal * (percent / 100);
        count = count.toFixed(4);
        if (count == 0) {
            count = '0';
        }
        this._onChange({target: {name: 'count', value: count}});
    },
    componentDidMount() {
        this.ScrollBar = initSellSlider(this._changeCount);
        MarketStore.addSellPriceListener(this._onPriceUpdate);
    },
    _onPriceUpdate() {
        this.setPrice(MarketStore.getSellPrice());
    },
    _toMaxCount() {
        this._changeCount(100);
        this._setSlider(this.state.maxCount);
    },
    setPrice: function (price) {
        this._onChange({target: {name: 'price', value: price + ''}})
    },
    _handlerInput(e,recommendPrize) {
        this.changed = true;
        this._onChange(e,recommendPrize);
        this._setSlider(this.state.count);
    },
    _onChange: HANDLER_INPUT_PRICE_COUNT,
    _check: CHECK_USER_STATE,
    _sell() {
        if (this._check() && !this.posting) {
            this.posting = true;
            this.setState({btnText: BTN_TEXT2[1], warnText: ''});
            let {price, count} = this.state;
            if ((price*count*1).toFixed(4)>50000){
                this.setState({warnText: WARN_TEXT[-35]});
                this.posting = false;
                this.setState({btnText: BTN_TEXT2[0]});
                return;
            }
            let pwd = this.refs.pwd.value;
            $.post('/market/sellBtcSubmit', {
                tradeAmount: count,
                tradeCnyPrice: price,
                tradePwd: pwd,
                symbol: symbol
            }, (res) => {
                MarketStore.refreshUserInfo();
                this.setState({btnText: BTN_TEXT2[0]});
                this.posting = false;
                if (res.resultCode === 0) {
                    this._setSlider(0);
                    this.changed = false;
                    this.setState({count: 0, money: 0});
                    updateNeedPassword();
                } else {
                    this.setState({warnText: WARN_TEXT[res.resultCode]})
                }
            }, 'json');
        }
    },
    render() {
        let {recommendPrizesell, virtotal, sname, sellFee} = this.props;
        let {price, count, money} = this.state;
        if (!virtotal) {
            virtotal = 0;
        }
        return (
            <div>
                <div className="f20 title c_green pl20">{`卖出${sname}`}</div>
                <div className="content">
                    <p style={{marginTop: 0}}>
                        <span className="db fl fir">最佳卖价：</span>
                        <span className="db fl f14 c_green"
                              onClick={this.setPrice.bind(null, recommendPrizesell)}>{recommendPrizesell}</span>
                        <span className="db fl pl10"></span>
                    </p>
                    <p style={{marginTop: 0}}>
                        <span className="db fl fir">最大可卖：</span>
                        <b className="db fl" onClick={this._toMaxCount}>{(virtotal).toFixed(4)}</b>
                        <span className="db fl pl10"></span>
                    </p>
                    <p style={{marginTop: 0}}>
                        <span className="db fl fir">卖出比例：</span>
                        <span className="db fl sell_Demo">
                    <span className="sell_Main clear db fl">
                      <span className="db fl sell_scrollBar">
                        <span className="db fl sell_scroll_Track" style={{width: "58.2px"}}></span>
                        <span className="db fl sell_scroll_Thumb" style={{marginLeft: "56.2px"}}></span>
                      </span>
                      <span className="fl db pl10 sell_scrollBarTxt">0%</span>
                    </span>
                  </span>
                    </p>
                    <p>
                        <span className="db fl fir">卖出价格：</span>
                        <input className="db fl" name="price" value={price} onChange={(e)=>this._handlerInput(e,recommendPrizesell)}
                               autoComplete="off"/>
                    </p>
                    <p>
                        <span className="db fl fir">卖出数量：</span>
                        <input className="db fl" name="count" value={count} onChange={this._handlerInput}
                               autoComplete="off"/>
                    </p>
                    <p>
                        <span className="db fl fir">手续费：</span>
                        <b className="db fl">{(sellFee * money).toFixed(4)}</b>
                        <span className="db fl pl10">{`(${(sellFee * 100).toFixed(1)}% CNY)`}</span>
                    </p>
                    <p style={{marginTop: 0}}>
                        <span className="db fl fir">总价：</span>
                        <b className="db fl">{money.toFixed(4)}</b>
                        <b className="db fl pl10">CNY</b>
                    </p>
                    <p style={{'display': this.props.needTradePasswd === false ? 'none' : 'block'}}>
                        <span className="db fl fir">交易密码：</span>
                        <input className="db fl" type="text" ref="pwd" onFocus={() => {
                            this.refs.pwd.type = 'password'
                        }}/>
                        <a href="/account/security.html" className="db fl pl10 c_blue">忘记密码？</a>
                    </p>
                    <p className="tac c_red" dangerouslySetInnerHTML={{__html: this.state.warnText}}></p>
                    <a href="javascript:void(0)" className="confirm bg_green c_white tac f16"
                       onClick={this._sell}>{this.state.btnText}</a>
                </div>
            </div>
        )
    }
})

exports.BuyContent = BuyContent;

exports.SellContent = SellContent;
