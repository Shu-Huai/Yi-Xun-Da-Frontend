// pages/newList/newsList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeName: "",
    weiboList: [],
    isListNull: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      placeName: options.placeName,
    })
    this.getNews();
  },
  getNews() {
    var that = this;
    var app = getApp();
    wx.request({
      url: app.globalData.url + "RealTime/getSuspectedResult?locationName=" + this.data.placeName,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.data.weiboList);
        if (res.data.data.weiboList.length == 0) {
          that.setData({
            isListNull: true
          })
        } else {
          for (let i = 0; i < res.data.data.weiboList.length; i++) {
            res.data.data.weiboList[i].createdAt = that.set_time(res.data.data.weiboList[i].createdAt)
          }
          that.setData({
            weiboList: res.data.data.weiboList
          })
        }
      }
    })
  },

  set_time: function (str) {
    var D = new Date(str);
    var year = D.getFullYear(); //四位数年份

    var month = D.getMonth() + 1; //月份(0-11),0为一月份
    month = month < 10 ? ('0' + month) : month;

    var day = D.getDate(); //月的某一天(1-31)
    day = day < 10 ? ('0' + day) : day;

    var hours = D.getHours(); //小时(0-23)
    hours = hours < 10 ? ('0' + hours) : hours;

    var minutes = D.getMinutes(); //分钟(0-59)
    minutes = minutes < 10 ? ('0' + minutes) : minutes;

    var now_time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
    return now_time;
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})