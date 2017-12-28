'use strict'

let charts = require('./charts');
let MarketStore = require('./MarketStore');

let symbol = MarketStore.getUserData().symbol;

let loadCharts = () => {
  $.getJSON('/market/depthData', {symbol: symbol}, function(data){
    charts.render(data)
  })
}

exports.init = () => {
  $(".coin_container").hover(function(){
		$(".coin_sel_box").show();
		$(this).find(".coin_title").addClass("cur");
	},function(){
		$(".coin_sel_box").hide();
		$(this).find(".coin_title").removeClass("cur");
	})
  $(".coin_sel_box").on('click', 'li', function(){
    location.href = $(this).find('a').attr('href');
  });
    var compare_timer=null;
  $("#title_sel").on('click', 'li', function(){
		var $this = $(this);
		var _index = $this.index();
		$this.addClass("cur").siblings().removeClass("cur");
		$("#content_sel").children("li").eq(_index).show().siblings().hide();
    if (_index == 2||_index == 3||_index == 4||_index == 5||_index == 6) {
      $('.entrust_wrapper').hide();
    } else {
      $('.entrust_wrapper').show();
    }

    if (_index == 1) {
      loadCharts(symbol);
    }

    if (_index == 2 && $.trim($('#detail-div').html()).length == 0) {
      $('#detail-div').load(`/market/detail.html?symbol=${symbol}`);
    }
    if (_index == 3 && $.trim($('#news-div').html()).length == 0) {
      $('#news-div').load(`/market/news.html?symbol=${symbol}`);
    }
    if (_index == 4) {
        compare_timer=setInterval(function(){
            $('#compare-div').load(`/market/compare.html?symbol=${symbol}`);
        },3000);
      $('#compare-div').load(`/market/compare.html?symbol=${symbol}`);
    }else{
        if(compare_timer!=null){
            clearInterval(compare_timer);
        }
    }
    if (_index == 5 && $.trim($('#hedging-div').html()).length == 0) {
      $('#hedging-div').load(`/market/hedging.html?symbol=${symbol}`);
    }

	});
}
