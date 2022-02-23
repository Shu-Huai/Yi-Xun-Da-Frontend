// components/chinamap.js
import * as echarts from '../../ec-canvas/echarts.js';
import geoJson from './mapData.js';
Component({
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      // 获取echarts组件，并赋值给变量，然后初始化图表
      this.oneComponent = this.selectComponent('#mychart-dom-area');
      this.getOneOption();
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    dataList : {       // 地图中展示的数据
      type: Array,
      value: []
    },
    dataPoint: {    // 为地图某个位置标点，本例中来实现，地图中某个省份清零后，为其省份插上小红旗
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ec: {
      lazyLoad: true  //设置图表懒加载
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置图表所需的option
    setOption(chart, dataList, dataPoint) {
 
      const option = {
        tooltip : {
          trigger: 'item',
          formatter: function(e, t, n) {
            return '地区：' + e.data.name + '\n确诊：' + e.data.value
          },
          textStyle:{
            align:'left'
          }
        },
    
        // title: {
        //   text: '中国疫情地图',
        //   textStyle: {
        //     color: '#000',
        //     fontSize: 24
        // },
        //   x: 'center'
        // },
    
        visualMap: {
          // type: 'piecewise',
          min: 0,
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            fontSize: 8
          },
          textGap: 5,
          left: 10,
          bottom: 5,
          showLabel: !0,
          //text: ['高', '低'],
          pieces: [{
            gt: 100,
            label: '> 100 人',
            color: '#7f1100',
            symbol: 'roundRect'
          }, {
            gte: 10,
            lte: 100,
            label: '10 - 100 人',
            color: '#ff5428'
          }, {
            gte: 1,
            lt: 10,
            label: '1 - 9 人',
            color: '#ff8c71'
          }, {
            value: 0,
            label: '0 人',
            color: 'rgb(248, 248, 248)',
            symbol: 'roundRect'
          }
        ],
          show: !0
        },
       
        series: [{
          type: 'map',
          map: 'china',
          label: {
            normal: {
              show: true,
              fontSize: 8
            },
            emphasis: {
              textStyle: {
                color: '#000'
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#000',
              areaColor: '#FFE3E3',
              borderWidth: .2
            },
            emphasis: {
              areaColor: '#FFE3E3',
              borderWidth: 0.2
            }
          },
          animation: false,
          markPoint: { //标记点
            symbol: 'path://M852.8 365c-71.6 11.8-188.4 15-266-132.2-83.2-158.2-217.6-163-296.2-148.6-38.2 7-66.8 39-66.8 70l0 393.2c22.6 8.6 46.8-0.4 53-1.6 1.6-0.4 3-0.6 4.8-1 50-11 102.8-16.2 233.6 46.6 164 78.6 307.6-66.2 363.2-167 4-7 17.4-40.4 17.4-72.4C876.4 360 852.8 365 852.8 365z M176 64 144 64c-8.8 0-16 7.2-16 16l0 864c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16L192 80C192 71.2 184.8 64 176 64z',
            symbolSize: 6, //图形大小
            label: {
              normal: {
                formatter: function(params) {
                  console.log(params);
                  return params.name;
                },
                show: false,
              },
              emphasis: {
                show: false,
              }
            },
            data: dataPoint
          },
          data: dataList
        }],
       };
      chart.setOption(option);
      chart.on
    },
   // 初始化图表
  init_one(dataList, dataPoint) {           //初始化图表
      this.oneComponent.init((canvas, width, height, dpr) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart);
        echarts.registerMap('china', geoJson);
        this.setOption(chart, dataList, dataPoint)  //赋值给echart图表
        chart.dispatchAction({
          type: 'showTip',
          seriesIndex:0,  // 显示第几个series
          dataIndex: 28 // 显示第几个数据
        })
        this.chart = chart
        return chart
      });
    },
 //初始化图表封装了一层
 getOneOption(){
      this.init_one(this.data.dataList, this.data.dataPoint)
    },
    
  }
  
})
