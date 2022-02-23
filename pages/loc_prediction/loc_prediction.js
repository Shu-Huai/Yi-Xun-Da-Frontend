// pages/loc_prediction/loc_prediction.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeList: [],
    picurl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getplace();
    this.setData({
      picurl: getApp().globalData.picurl
    })
  },
  getplace() {
    var that = this;
    var app = getApp();
    wx.request({
      url: app.globalData.url + "RealTime/getAllSuspectedLocationsInCoordinates",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        var placeNameList = [];
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].mapResponseDto.status == 0) {
            placeNameList.push(res.data.data[i].locationName)
          }
        }
        console.log(placeNameList)
        for (let i = 0; i < placeNameList.length; i++) {
          wx.request({
            url: app.globalData.url + "RealTime/getSuspectedResult?locationName=" + placeNameList[i],
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              //console.log(res.data.data);
              let placeList = that.data.placeList;
              that.setData({
                placeList: placeList.concat({
                  placeName: placeNameList[i],
                  diagnosisRate: res.data.data.diagnosisRate.toFixed(2),
                  closeRate: res.data.data.closeRate.toFixed(2),
                })
              })
            }
          })
        }
      }
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})