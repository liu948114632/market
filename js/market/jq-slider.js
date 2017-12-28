
exports.initBuySlider = function(callback) {
  var $con = $('#buy-content');
  var setPercent = function(percent) {
      percent = Math.round(($con.find(".scrollBar").width() / 100 * percent));
      setValue(percent)
  }
  function setValue(_currentValue, cb) {
      currentValue = _currentValue;
      var mleft = currentValue;
      var mwidth = currentValue;
      if ((currentValue + 15) >= $con.find(".scrollBar").width()) {
          var swidth = $con.find(".scrollBar").width();
          mleft = swidth-10;
          mwidth = swidth;
      } else if (currentValue <= 0) {
          mleft = 0;
          mwidth = 0;
      }
      $con.find(".scroll_Thumb").css("margin-left", mleft + "px");
      $con.find(".scroll_Track").css("width", mwidth + 7 + "px");
      var percent = Math.round(100 * (currentValue / ($(".scrollBar").width())));
      if (percent > 100) {
          percent = ScrollBar.maxValue;
      } else if (percent < 0) {
          percent = 0;
      }
      ScrollBar.value = percent;
      $con.find(".scrollBarTxt").html(ScrollBar.value + "%");
      cb && cb(percent);
  }

  var valite = false;
  var currentValue = 0;

  var ScrollBar = {value: 0,maxValue: 100,step: 1,currentX: 0,
    setPercent: setPercent,
		Initialize: function() {
			if (this.value > this.maxValue) {
				alert("给定当前值大于了最大值");
				return;
			}
			this.GetValue();
			$con.find(".scroll_Track").css("width", this.currentX + 7 + "px");
			$con.find(".scroll_Thumb").css("margin-left", this.currentX + "px");
			this.Value();
			$con.find(".scrollBarTxt").html(ScrollBar.value + "%");
		},
		Value: function() {
      $con.find('.scrollBar').on('click', function(event){
          var sleft = $(".scrollBar").offset().left;
          var clientX = event.clientX;
          setValue((clientX-sleft), callback)
      })
			$con.find(".scroll_Thumb").mousedown(function() {
				valite = true;
			});
      $(document.body).mousemove(function(event) {
        if (valite == false) return;
        var changeX = event.clientX - ScrollBar.currentX;
        var currentValue = changeX - ScrollBar.currentX-$con.find(".Demo").offset().left;
        setValue(currentValue, callback)
      });
			$(document.body).mouseup(function() {
        valite = false;
				ScrollBar.value = Math.round(100 * (currentValue / $con.find(".scrollBar").width()));
				if (ScrollBar.value >= ScrollBar.maxValue) ScrollBar.value = ScrollBar.maxValue;
				if (ScrollBar.value <= 0) ScrollBar.value = 0;
				$con.find(".scrollBarTxt").html(ScrollBar.value + "%");
			});
		},
		GetValue: function() {
			this.currentX = $con.find(".scrollBar").width() * (this.value / this.maxValue);
		}
	};
	//初始化
	ScrollBar.Initialize();
  return ScrollBar;
}

exports.initSellSlider = function(callback) {
  var $con = $('#sell-content');
  var setPercent = function(percent) {
      percent = Math.round(($con.find(".sell_scrollBar").width() / 100 * percent));
      setValue(percent)
  }
  function setValue(_currentValue, cb) {
      currentValue = _currentValue;
      var mleft = currentValue;
      var mwidth = currentValue;
      if ((currentValue + 15) >= $con.find(".sell_scrollBar").width()) {
          var swidth = $con.find(".sell_scrollBar").width();
          mleft = swidth-10;
          mwidth = swidth;
      } else if (currentValue <= 0) {
          mleft = 0;
          mwidth = 0;
      }
      $con.find(".sell_scroll_Thumb").css("margin-left", mleft + "px");
      $con.find(".sell_scroll_Track").css("width", mwidth + 7 + "px");
      var percent = Math.round(100 * (currentValue / ($(".sell_scrollBar").width())));
      if (percent > 100) {
          percent = ScrollBar.maxValue;
      } else if (percent < 0) {
          percent = 0;
      }
      ScrollBar.value = percent;
      $con.find(".sell_scrollBarTxt").html(ScrollBar.value + "%");
      cb && cb(percent);
  }

  var valite = false;
  var currentValue = 0;

  var ScrollBar = {value: 0,maxValue: 100,step: 1,currentX: 0,
    setPercent: setPercent,
		Initialize: function() {
			if (this.value > this.maxValue) {
				alert("给定当前值大于了最大值");
				return;
			}
			this.GetValue();
			$con.find(".sell_scroll_Track").css("width", this.currentX + 7 + "px");
			$con.find(".sell_scroll_Thumb").css("margin-left", this.currentX + "px");
			this.Value();
			$con.find(".sell_scrollBarTxt").html(ScrollBar.value + "%");
		},
		Value: function() {
      $con.on('click', '.sell_scrollBar', function(event){
          var sleft = $(".sell_scrollBar").offset().left;
          var clientX = event.clientX;
          setValue((clientX-sleft), callback)
      })
			$con.find(".sell_scroll_Thumb").mousedown(function() {
				valite = true;
				$(document.body).mousemove(function(event) {
					if (valite == false) return;
					var changeX = event.clientX - ScrollBar.currentX;
					currentValue = changeX - ScrollBar.currentX-$con.find(".sell_Demo").offset().left;
					setValue(currentValue, callback)
				});
			});
			$(document.body).mouseup(function() {
				ScrollBar.value = Math.round(100 * (currentValue / $con.find(".sell_scrollBar").width()));
				valite = false;
				if (ScrollBar.value >= ScrollBar.maxValue) ScrollBar.value = ScrollBar.maxValue;
				if (ScrollBar.value <= 0) ScrollBar.value = 0;
				$con.find(".sell_scrollBarTxt").html(ScrollBar.value + "%");
			});
		},
		GetValue: function() {
			this.currentX = $con.find(".sell_scrollBar").width() * (this.value / this.maxValue);
		}
	};
	//初始化
	ScrollBar.Initialize();
  return ScrollBar;
}
