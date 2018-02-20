

// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var APP = getApp()
var GP;
var KEY_SESSION = "session"
var KEY_LOGO = "logo"

//历史记录筛选方式
// var ROLE_NORMAL_ID 
// var ROLE_VIP_ID
// var ROLE_SUPER_VIP_ID

// var PAY_MODE_SINGLE = 3;
  
Page({
    data:{
        userId:"20014",
        userName:"丰兄",

        //华讯数据
                // logo:"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKVjOuco39iayJdXxibXMCLI1PEgIt9gxpeqnSISmg1iav8rUWAZLFSSWfvGSgkAgicHic0kQTZeVVVDrA/0",
        logo:"",
        name:"this.丰兄",
        user_id:"12",
        

        icon1: '../../images/mine_fill.png',
        icon2: '../../images/order_fill.png',
        icon3: '../../images/coupons_fill.png',
        icon4: '../../images/label_fill.png',
        icon5: '../../images/search_blue.png',
        // icon4: '../../images/label_fill.png',

        isOpenClock:false,
        time: '12:01',
        adList: [
            // {
            //     title: "Rap的押韵搜索",
            //     img_url: "../../images/qr_yayun.jpg",
            // },
            // {
            //     title: "Rap的押韵搜索",
            //     img_url: "../../images/qr_yayun.jpg",
            // },
        ],

    },

    previewImage(e){
        
        wx.previewImage({
            urls: [e.currentTarget.dataset.image_url],
        })
    },
    clockSwitch(e){
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            isOpenClock: e.detail.value
        })
    },
    timeChange(e){
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            time: e.detail.value
        })
    },





    SetUserInfo:() =>{
        wx.getUserInfo({
            success: function (res) {
                var userInfo = res.userInfo
                // var nickName = userInfo.nickName
                // var avatarUrl = userInfo.avatarUrl
                // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                // var province = userInfo.province
                // var city = userInfo.city
                // var country = userInfo.country
                console.log(userInfo)
                wx.setStorageSync(KEY_LOGO, userInfo.avatarUrl)
                GP.setData({
                    logo: userInfo.avatarUrl,
                    name: userInfo.nickName,
                })
                wx.request
                ({
                    url: API.MY_SET_LOGO,
                    method: "GET",
                    data: {
                        session : wx.getStorageSync(KEY_SESSION),
                        logo_url : userInfo.avatarUrl,
                        nick_name : userInfo.nickName,
                    },
                    success: function (res) {
                    },
                    fail: function (res) {
                    },
                })
            },
        })
    },

  //更新用户的浏览记录，用户数据等
  getUserInfo:function(){
    wx.request
    ({  
        url: API.MY_INDEX, 
        method:"GET",
        data:{
            session: wx.getStorageSync(KEY_SESSION),
        },
        success: function(res)
        {
            var object = res.data
            console.log(object)
            if (object.status == "true") //登陆成功
            {
                // console.log(object.user.is_remain)
                var _logo = object.logo
                var _name = object.nick_name
                if (_logo == "" || _logo == undefined || _logo == 'undefined') {
                    // GP.userLogin()
                    _logo = '../../images/click_login.png'
                    _name = ""
                }
                GP.setData({
                    user_id: object.user_id,
                    logo: _logo,
                    name: _name,
                    adList:object.ad_list,
                })
                if (object.is_remain)
                    GP.AlertModal(object.user.level, object.user.vip_time)
                  
            }
            else{

            }        
        },
        fail:function(res) { 
        },
    })
  },
  
  

  
  //根据id获取节目信息
    onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
        GP = this
        //更新缓存头像
        GP.setData({
            logo: wx.getStorageSync(KEY_LOGO),
        })

        //必须要登陆以后再做的事情
        if(APP.globalData.isLogin == true)
            GP.onInit(options)
        else
            APP.login(options)

    },
    userLogin: function () {
        wx.openSetting({
            success: (res) => {
                console.log("授权结果..")
                console.log(res)
                if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                    GP.SetUserInfo()
                }
            }
        })
    },
    //必须要登陆以后发起的请求，在这里完成
    onInit:function(option){
        GP.SetUserInfo()  //每一次进来都获取新头像
        GP.getUserInfo()
    },

    onReady:function(){
        // 页面渲染完成
    },
    onShow:function(){
        //   if (APP.globalData.isLogin == true){

            //   GP.getUserInfo()
        //   }
    },

//   onShareAppMessage: function () { 
//       return {
//           title: '叮叮看电视',
//           desc: '百万部视频，叮叮立即看',
//           path: '/pages/ware_out/ware_out?id=' + GP.data.id
//       }
//   },

})