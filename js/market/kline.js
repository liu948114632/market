'use strict'


Highcharts.setOptions({
  global: {
    useUTC: false
    },
    rangeSelector: {

buttons: [{
        type: 'week',
        count: 1,
        text: '1周'
    }, {
        type: 'month',
        count: 1,
        text: '1月'
    }, {
        type: 'month',
        count: 3,
        text: '3月'
    }, {
        type: 'month',
        count: 6,
        text: '6月'
    }, {
        type: 'ytd',
        text: '1季度'
    }, {
        type: 'year',
        count: 1,
        text: '1年'
    }, {
        type: 'all',
        text: '全部'
    }],
    buttonTheme: {
      width: 36,
      height: 16,
      padding: 1,
      r: 0,
      stroke: '#68A',
      zIndex: 7
    },
      inputDateFormat: '%Y-%m-%d',
      inputEditDateFormat: '%Y-%m-%d',
      selected: 1//表示以上定义button的index,从0开始
    },
    lang:{
      shortMonths:['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月','九月',  '十月','十一月', '十二月'],
      weekdays:['星期日',  '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    }
});

let showKline = (data) => {
  console.log(data);

        var ohlc = [],
            volume = [],
            dataLength = data.length,
            // set the allowed units for data grouping
            groupingUnits = [[
                'week',                         // unit name
                [1]                             // allowed multiples
            ], [
                'week',
                [1, 2, 3, 4, 5, 6]
            ]],

            i = 0;

        for (i; i < dataLength; i += 1) {
            ohlc.push([
                data[i][0] * 1000, // the date
                data[i][1], // open
                data[i][2], // high
                data[i][3], // low
                data[i][4] // close
            ]);

            volume.push([
                data[i][0] * 1000, // the date
                data[i][5] // the volume
            ]);
        }


        // create the chart
        $('#container').highcharts('StockChart', {

            rangeSelector: {
                selected: 5,
            },

            title: {
                text: ''
            },

            yAxis: [{
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: '价格'
                },
                height: '60%',
                lineWidth: 2
            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: '交易量'
                },
                top: '65%',
                height: '35%',
                offset: 0,
                lineWidth: 2
            }],

            series: [{
                type: 'candlestick',
                name: 'AAPL',
                data: ohlc,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'column',
                name: 'Volume',
                data: volume,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }],

            lang: {
              shortMonths: ["xx"],
              months: ["0000"],
            }
        });

}

exports.loadKline = (setp, symbol) => {
  // $.getJSON(`/market/period.html?step=${setp}&symbol=${symbol}`, showKline)
  //$.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-ohlcv.json&callback=?', showKline)
}
