// pages/board/board.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tip:"",
    allList: [{
      curConfirm:0,
      curConfirmRelative:0,
      asymptomatic:0,
      asymptomaticRelative:0,
      unconfirmed: 0,
      unconfirmedRelative: 0,
      serious: 0,
      seriousRelative: 0,
      relativeTime: '',
    
    }],
    dataPoint: [{"name":"南海诸岛","coord":[130,22],"value":0},{"name":"西藏","coord":[89.132212,32.110361],"value":0}],
    dataList: [
      { name: '南海诸岛', value: 0 },
      { name: '北京', value: 0 },
      { name: '天津', value: 0 },
      { name: '上海', value: 0 },
      { name: '重庆', value: 0 },
      { name: '河北', value: 0 },
      { name: '河南', value: 0 },
      { name: '云南', value: 0 },
      { name: '辽宁', value: 0 },
      { name: '黑龙江', value: 0 },
      { name: '湖南', value: 0},
      { name: '安徽', value: 0 },
      { name: '山东', value: 0 },
      { name: '新疆', value: 0 },
      { name: '江苏', value: 0 },
      { name: '浙江', value: 0 },
      { name: '江西', value: 0 },
      { name: '湖北', value: 0 },
      { name: '广西', value: 0},
      { name: '甘肃', value: 0},
      { name: '山西', value: 0 },
      { name: '内蒙古', value: 0 },
      { name: '陕西', value: 0 },
      { name: '吉林', value: 0},
      { name: '福建', value: 0 },
      { name: '贵州', value: 0 },
      { name: '广东', value: 0 },
      { name: '青海', value: 0 },
      { name: '西藏', value: 0 },
      { name: '四川', value: 0 },
      { name: '宁夏', value: 0},
      { name: '海南', value: 0 },
      { name: '台湾', value: 0 },
      { name: '香港', value: 0 },
      { name: '澳门', value: 0 }
    ],
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.stopPullDownRefresh();
    // this.mapComponent = this.selectComponent('#mapComponent')//获取自定义地图组件的实例
    // this.mapComponent.getOneOption();
    this.getSumData();
    this.getProvinceData();

    this.getTip();
    console.log(this.data.tip);
  },
  getTip() {
    var that = this;
    var app = getApp();
    wx.request({
        url:app.globalData.url +"Covid/getOneTips",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          //console.log(res)
          //console.log(res.data.data.content)
          that.setData({
            tip:res.data.data.content
          });
          
        }
      })
  },
  getSumData() {
    var that = this;
    var app = getApp();
    wx.request({
      url: app.globalData.url + "Covid/getAllSumDom",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res)
          that.setData({
            'allList[0].relativeTime':res.data.data["0"].relativeTime,
            'allList[0].curConfirm':res.data.data["0"].curConfirm,
            'allList[0].curConfirmRelative':res.data.data["0"].curConfirmRelative,
            'allList[0].asymptomatic':res.data.data["0"].asymptomatic,
            'allList[0].asymptomaticRelative':res.data.data["0"].asymptomaticRelative,
            'allList[0].unconfirmed':res.data.data["0"].unconfirmed,
            'allList[0].unconfirmedRelative':res.data.data["0"].unconfirmedRelative,
            'allList[0].serious':res.data.data["0"].serious,
            'allList[0].seriousRelative':res.data.data["0"].seriousRelative,
            

          })

        }
      })
  },
  getProvinceData() {
    var that = this;
    var app = getApp();
    wx.request({
      url: app.globalData.url + "Covid/getAllProvince?pageNum=1&pageSize=34",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res)
          that.setData({
            btnClickIndex : 1,
    dataPoint: [{"name":"南海诸岛","coord":[130,22],"value":0},{"name":"西藏","coord":[89.132212,32.110361],"value":0}],
    dataList: [
      { name: '南海诸岛', value: 0 },
      { name: '北京', value:res.data.data["22"].curConfirm },
      { name: '天津', value: res.data.data["11"].curConfirm },
      { name: '上海', value: res.data.data["21"].curConfirm },
      { name: '重庆', value: res.data.data["27"].curConfirm },
      { name: '河北', value:res.data.data["16"].curConfirm },
      { name: '河南', value: res.data.data["30"].curConfirm },
      { name: '云南', value: res.data.data["18"].curConfirm },
      { name: '辽宁', value:res.data.data["13"].curConfirm },
      { name: '黑龙江', value: res.data.data["14"].curConfirm },
      { name: '湖南', value: res.data.data["29"].curConfirm },
      { name: '安徽', value: res.data.data["28"].curConfirm},
      { name: '山东', value: res.data.data["25"].curConfirm },
      { name: '新疆', value: res.data.data["7"].curConfirm },
      { name: '江苏', value: res.data.data["23"].curConfirm },
      { name: '浙江', value:res.data.data["32"].curConfirm },
      { name: '江西', value: res.data.data["26"].curConfirm },
      { name: '湖北', value: res.data.data["33"].curConfirm },
      { name: '广西', value:res.data.data["19"].curConfirm },
      { name: '甘肃', value:res.data.data["10"].curConfirm },
      { name: '山西', value: res.data.data["12"].curConfirm },
      { name: '内蒙古', value: res.data.data["9"].curConfirm },
      { name: '陕西', value: res.data.data["17"].curConfirm },
      { name: '吉林', value: res.data.data["6"].curConfirm },
      { name: '福建', value:res.data.data["20"].curConfirm },
      { name: '贵州', value: res.data.data["5"].curConfirm },
      { name: '广东', value: res.data.data["31"].curConfirm },
      { name: '青海', value:  res.data.data["0"].curConfirm },
      { name: '西藏', value: res.data.data["0"].curConfirm },
      { name: '四川', value: res.data.data["24"].curConfirm },
      { name: '宁夏', value: res.data.data["8"].curConfirm },
      { name: '海南', value: res.data.data["15"].curConfirm },
      { name: '台湾', value:res.data.data["3"].curConfirm},
      { name: '香港', value: res.data.data["4"].curConfirm },
      { name: '澳门', value:res.data.data["1"].curConfirm}
    ]
          }),
          that.mapComponent = that.selectComponent('#mapComponent')//获取自定义地图组件的实例
          that.mapComponent.getOneOption();
        }
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady:function(){
    const _this = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        //console.log(latitude)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  hisBtnClickMap() {
    this.getProvinceData();
    this.mapComponent.getOneOption()
  },
  gotoShmap(){
    wx.navigateTo({
      url:'../SH_data/SH_data'
    })
  }
})