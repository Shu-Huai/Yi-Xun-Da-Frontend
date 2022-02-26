Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    scale: 18,
    markers: [],
    id_type: [], //该数组用来记录id与类型的对应关系，和markers在同一位置初始化
    circles: [], //用于画圈
    name: null,
    distance: null,
    type: null,
    hastap: false,
    picurl: "",
    tags:[
      {
        url:"../../images/marker_high.png",
        meaning:"高风险"
      },
      {
        url:"../../images/marker_mid.png",
        meaning:"中风险"
      },
      {
        url:"../../images/marker_sus.png",
        meaning:"疑似"
      }
    ]
  },
  onLoad: function (e) {
    this.setData({
      hastap: false,
      picurl: getApp().globalData.picurl
    });
    this.getNowLocation();
    this.getAllTracksInCoordinates();
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap');
    this.moveToLocation();
    this.mapCtx.addMarkers({
      markers: this.data.markers
    });
  },
  getNowLocation: function () { // 获取当前地址
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.latitude)
        console.log(res.longitude)
      }
    })
  },
  moveToLocation: function () {
    this.getNowLocation()
    this.mapCtx.moveToLocation()
  },

  ReqAssis:function(UrlNow,pagen,shiftcount,templist,tmp2,tmpcircles,that){
    var tag=(UrlNow=="RealTime/getMediumRiskPlace")
    wx.request({
      url: getApp().globalData.url +UrlNow,
      data:{
        pageNum:pagen,
        pageSize:10
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if(res.data.data.length>0){
          var i;
          for (i = 0; i < res.data.data.length; i++) {
            if (!res.data.data[i].mapResponseDto.status) {
              templist.push({
                id: shiftcount+i,
                latitude: res.data.data[i].mapResponseDto.result.location.lat,
                longitude: res.data.data[i].mapResponseDto.result.location.lng,
                width: 50,
                height: 50,
                joinCluster: true,
                iconPath: tag?"../../images/marker_mid.png":"../../images/marker_high.png",
                callout: {
                  content: res.data.data[i].riskPlace.areaName, //每个位置的地点名称
                  display: "BYCLICK",
                  textAlign: "center",
                  color: "#000000",
                  borderWidth: 1,
                  borderColor: "#808080",
                  bgColor: "#e9e7ef",
                  padding: 3,
                  fontSize: 15,
                  borderRadius: 10
                }
              });
              tmp2.push({
                id: i+shiftcount,
                typ: tag?"中风险":"高风险" 
              });
              tmpcircles.push({
                latitude: res.data.data[i].mapResponseDto.result.location.lat,
                longitude: res.data.data[i].mapResponseDto.result.location.lng,
                fillColor:tag?'#FFD70032': '#E77C8E32',
                color: tag?'#FFD700':'#E77C8E',
                radius: 1000,
                strokeWidth: 2
              });            
            }
          }
          shiftcount=i+shiftcount;
          that.ReqAssis(UrlNow,pagen+1,shiftcount,templist,tmp2,tmpcircles,that)
        }else{
          if(UrlNow=="RealTime/getHighRiskPlace"){
            that.setData({
              markers: templist,
              id_type: tmp2,
              circles: tmpcircles
            })
            wx.hideLoading()
          }else{
            that.ReqAssis("RealTime/getHighRiskPlace",1,shiftcount,templist,tmp2,tmpcircles,that)
          }          
        }        
      }
    })
  },
  getAllTracksInCoordinates: function () {
    wx.showLoading({
      title: '数据获取中'
    })
    var that = this;
    var templist = [];
    var tmp2 = [];
    var tmpcircles = [];
    wx.request({
      url: getApp().globalData.url + "RealTime/getAllSuspectedLocationsInCoordinates",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        var i;        
        for (i = 0; i < res.data.data.length; i++) {
          if (!res.data.data[i].mapResponseDto.status) {
            templist.push({
              id: i,
              latitude: res.data.data[i].mapResponseDto.result.location.lat,
              longitude: res.data.data[i].mapResponseDto.result.location.lng,
              width: 50,
              height: 50,
              joinCluster: true,
              iconPath: "../../images/marker_sus.png",
              callout: {
                content: res.data.data[i].locationName, //每个位置的地点名称
                display: "BYCLICK",
                textAlign: "center",
                color: "#000000",
                borderWidth: 1,
                borderColor: "#808080",
                bgColor: "#e9e7ef",
                padding: 3,
                fontSize: 15,
                borderRadius: 10
              }
            });
            tmp2.push({
              id: i,
              typ: "疑似" 
            });
            tmpcircles.push({
              latitude: res.data.data[i].mapResponseDto.result.location.lat,
              longitude: res.data.data[i].mapResponseDto.result.location.lng,
              fillColor: '#70809032',
              color: '#708090',
              radius: 1000,
              strokeWidth: 2
            });            
          }
        }
        that.ReqAssis("RealTime/getMediumRiskPlace",1,i,templist,tmp2,tmpcircles,that);
      }      
    });    
  },
  //进行经纬度转换为距离的计算
  Rad: function (d) {
    return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
  },
  //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
  GetDistance: function (lat1, lng1, lat2, lng2) {
    var radLat1 = this.Rad(lat1);
    var radLat2 = this.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.Rad(lng1) - this.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000; //输出为公里
    return s;
  },
  clickmarker: function (e) {
    for (var p = 0; p < this.data.markers.length; p++) {
      if (e.detail.markerId == this.data.markers[p].id) {
        var la = this.data.markers[p].latitude;
        var lo = this.data.markers[p].longitude;
        this.setData({
          name: this.data.markers[p].callout.content,
          hastap: true,
          distance: this.GetDistance(la, lo, this.data.latitude, this.data.longitude)
        })
        break;
      }
    }
    for (var p = 0; p < this.data.id_type.length; p++) {
      if (e.detail.markerId == this.data.id_type[p].id) {
        this.setData({
          type: this.data.id_type[p].typ
        })
        break;
      }
    }
  },
  close: function () {
    this.setData({
      hastap: false
    })
  },
  onChangeAddress: function () {
    var that = this;
    var templist = [];
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        }),
        that.mapCtx.moveToLocation({
          latitude: res.latitude,
          longitude: res.longitude,
        }),
        templist.push({
          id: -1,
          name:"LocalIcon",
          iconPath: getApp().globalData.picurl + "images/searchMarker.png",
          latitude: res.latitude,
          longitude: res.longitude,
          width: 50,
          height: 50,
        }),
        that.mapCtx.removeMarkers({
          markerIds:[-1],
          fail(res){
            console.log(res)
          },
        }),
        that.mapCtx.addMarkers({
          markers: templist,
          clear: false
        }),
        console.log(res.longitude);
        console.log(res.latitude);
        console.log(templist);
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },
})