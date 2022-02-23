// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tip: "",
    newsList: [],

    text: "",
    showMore: false,
    marqueePace: 0.5, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 120,
    size: 14,
    orientation: 'left', //滚动方向
    interval: 20, // 时间间隔 
    picurl:"",
    latitude:111.1,
    longitude:22.1,
    locationList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNowLocation();
    this.getTip();
    this.setData({
      picurl:getApp().globalData.picurl
    })
  },
  getNowLocation: function () { // 获取当前地址
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getLocName();
        that.getNews();
      }
    })
  },
  getLocName(){
    var that = this;
    var app = getApp();
    wx.request({
      url: app.globalData.url + "RealTime/getReverseGeocoding?lat="+that.data.latitude+"&lng="+that.data.longitude,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res)       
        that.setData({
          locationList:res.data.data
        });
        
      }
    })
  },
  getTip() {
    var that = this;
    var app = getApp();
    wx.request({
      url: app.globalData.url + "Covid/getOneTips",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res)
        //console.log(res.data.data.content)
        that.setData({
          text: "疫情小贴士：" + res.data.data.content
        });
        that.showTip();
      }
    })
  },
  getNews() {
    var that = this;
    var app = getApp();
    wx.request({
      url: app.globalData.url + "RealTime/getRecoEightBlogs?lat=" + that.data.latitude + "&lng=" + that.data.longitude,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res)
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].pics != "") {
            res.data.data[i].pics = res.data.data[i].pics.split(',');
          }
          if(res.data.data[i].text.length>30*5){
            res.data.data[i]["status"] = true;
            res.data.data[i]["tip"] = '查看更多';
          }
          res.data.data[i]["createdAt"]=res.data.data[i]["createdAt"].substring(0,10);
        }
        console.log(res)
        that.setData({
          newsList: res.data.data
        })
      }
    })
  },
  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
  toggle: function (event) {
    // console.log(event.currentTarget.dataset.index);
    const index = event.currentTarget.dataset.index
    const status = this.data.newsList[index].status
    var temp_status = 'newsList[' + index + '].status';
    var temp_tip = 'newsList[' + index + '].tip';
    if(this.data.newsList[index].text.length>30*5){
      this.setData({
        [temp_tip]: status ? '收起' : '查看更多',
        [temp_status]: !status,
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  showTip: function () {
    // =============
    // 页面显示
    var vm = this;
    var length = vm.data.text.length * vm.data.size; //文字长度
    let windowWidth = '';
    // var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
    let query = wx.createSelectorQuery()
    query.select('.text').boundingClientRect()
    query.exec((rect) => {
      windowWidth = rect[0].width
    })
    vm.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin //当文字长度小于屏幕长度时，需要增加补白
    });
    vm.run2(); // 第一个字消失后立即从右边出现

  },
  // ===========
  run2: function () {
    var vm = this;
    var interval = setInterval(function () {
      if (-vm.data.marqueeDistance2 < vm.data.length) {
        // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
        vm.setData({
          marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
          marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
        });
      } else {
        if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
          vm.setData({
            marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
          });
          clearInterval(interval);
          vm.run2();
        } else {
          clearInterval(interval);
          vm.setData({
            marqueeDistance2: -vm.data.windowWidth
          });
          vm.run2();
        }
      }
    }, vm.data.interval);
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

  }
})