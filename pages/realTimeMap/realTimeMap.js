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
        console.log(res)
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
  getAllTracksInCoordinates: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + "Track/getAllTracksInCoordinates",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var templist = [];
        var tmp2 = [];
        var tmpcircles = [];
        console.log(res);
        for (var i = 0; i < res.data.data.length; i++) {
          if (!res.data.data[i].mapResponseDto.status) {
            templist.push({
              id: i,
              latitude: res.data.data[i].mapResponseDto.result.location.lat,
              longitude: res.data.data[i].mapResponseDto.result.location.lng,
              width: 50,
              height: 50,
              joinCluster: true,
              iconPath: getApp().globalData.picurl + "images/marker.png",
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
            var typetmp = res.data.data[i].mapResponseDto.result.level;
            tmp2.push({
              id: i,
              typ: typetmp == "NoClass" ? "暂无" : typetmp //场所类型，对应level
            });
            tmpcircles.push({
              latitude: res.data.data[i].mapResponseDto.result.location.lat,
              longitude: res.data.data[i].mapResponseDto.result.location.lng,
              fillColor: '#E77C8E32',    //#E77C8E32  rgba(231,124,142,0.2)
              color: '#E77C8E',      //#E77C8E  rgba(231,124,142,1)
              radius: 1000,
              strokeWidth: 2
            });
          }
        }
        that.setData({
          markers: templist,
          id_type: tmp2,
          circles: tmpcircles
        })
        console.log(templist)
        //onsole.log(tmp2)
        //console.log(tmpcircles)
      }
    })
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
    s = s * 6378.137; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出为公里
    //s=s.toFixed(2);
    return s;
  },
  clickmarker: function (e) {
    console.log(e)
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
          //iconPath: "../../images/board.png",
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