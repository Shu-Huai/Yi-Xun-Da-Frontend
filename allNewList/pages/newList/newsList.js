// pages/newList/newsList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: [],
    index: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.index = 1;
    this.getNews();
  },
  getNews() {
    var that = this;
    var app = getApp();
    wx.request({
      url: app.globalData.url + "Covid/getAllBlogs?pageNum=" + this.data.index + "&pageSize=10",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
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
        // console.log(res)
        that.setData({
          newsList: that.data.newsList.concat(res.data.data)
        });
        wx.hideLoading()
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
    this.data.index = this.data.index + 1;
    wx.showLoading({
        title: '加载中...',
      }),
      this.getNews();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})