// pages/info/info.js
Page({
  data: {
      url:"../../images/centerun.png",
      tag:false,       //用于表示是否登录，false为未登录，true为已登录
      greetings:"你好，",
      name:null,
      in:"轻触头像登录",
      show1:"健康码",
      show2:"行程码",
      show3:"退出登录",
  },

  HealthCode(){
    wx.navigateToMiniProgram({
      appId:"wx2eec5fb00157a603",   //国家政务平台
    })
  },

  TripCode(){
    wx.navigateToMiniProgram({
      appId:"wx8f446acf8c4a85f5",   //通信行程卡
    })
  },   

  bindViewTap() {           
    if(this.data.tag==false){
      var app = getApp();
      var that = this;
      wx.getUserProfile({
        desc:"用于完善资料",//不写不弹提示框         
        success:function(res){
          wx.login({
            success (mm) {
              //console.log(mm.code)
              wx.request({
                url: app.globalData.url+"Login/loginByCode",
                data: {
                  code:mm.code
                }
              })
            }
          })               
          that.setData({            
            url:res.userInfo.avatarUrl,
            tag:true,
            name:res.userInfo.nickName
            })                    
          //app.globalData.userInfo=res.userInfo //存储用户信息
          console.log('获取成功: ',res)
          wx.showToast({
            title:'授权成功',
            mask:true
          })
          /*
          setTimeout(res=>{
            //跳转到上级界面
            wx.navigateBack();
          }, 1500)
          */
        },
        fail:function(err){
          console.log("获取失败: ",err)
          wx.showToast({
            title:'登陆失败',
            icon:"error",
            mask:true
          })
          //wx.navigateBack();
        }
      })
    }    
  },

  logout(){
    if(this.data.tag==true){
      this.setData({
        url:"../../images/centerun.png",
        tag:false,
        name:null
      })      
    }    
  },

  about(){
    wx.navigateTo({
      url:"/pages/about/about"
    })
  },

  preferences(){
    wx.navigateTo({
      url:"/pages/preferences/preferences"
    })
  }
})