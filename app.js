//app.js
var API = require('utils/api.js');
var Key = require('utils/storage_key.js');
var g
var GLOBAL_PAGE
App({
    //全局变量配置
    STATIC: {  
    },

    //支付页面的四种情况
    PAY_METHOD: {
        METHOD_NORMAL_2_VIP: '1001',
        METHOD_NORMAL_2_SUPER_VIP: '1002',
        METHOD_VIP_2_SUPER_VIP: '1003',
        METHOD_OFF_LINE : '1004',
        METHOD_VIP_OR_SUPER_VIP: '1005',
    },
    globalData:{
        pagePrivate:null,
        pagePublic:null,
        windowWidth:null,
        windowHeight:null,
        isLogin: false,
    }, 
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // this.getUserInfo()

        var that =this
        GLOBAL_PAGE = this
        var _pixelRatio,_windowWidth,_windowHeight
        
        wx.getSystemInfo({
          success: function(res) {
            //设置屏幕宽/高
            // console.log(res)
            that.globalData.windowWidth = res.windowWidth
            that.globalData.windowHeight = res.windowHeight

            console.log(res.windowWidth,res.windowHeight,res.pixelRatio)
          }
        })

        // that.login()
    },

    login:function(option){
        console.log("session:", wx.getStorageSync('session') )
        wx.login
        ({
            success: function (res) 
            {
                

              var _session = wx.getStorageSync('session') 
              if (! _session  ) //检查session,不存在，为false
                    _session = "false"
              var url = API.USER_LOGIN
              console.log(res.code)
              wx.request
              ({  
                    url: url, 
                    method:"GET",
                    data:{
                        js_code:res.code,
                        session:_session,
                    },
                    success: function(res)
                    {
                        console.log("success:")
                        console.log(res)
                        
                        //初始化静态变量
                        GLOBAL_PAGE.STATIC = res.data.util

                        wx.setStorageSync('session', res.data.session)
                        //Todo 初始化页面、目录
                        // GLOBAL_PAGE.onInit()
                        getCurrentPages()[0].onInit(option)

                        GLOBAL_PAGE.globalData.isLogin = true
                        //暂时专供抢画后保存图片用，日后与login合体
                             
                    },
                    fail:function(res) { 
                        wx.showModal({
                        title: '网络连接失败，是否重新登陆？',
                        content:'请确认网络是否正常',
                        confirmText:"重新登陆",
                        success: function(res) {
                            if (res.confirm) {
                                GLOBAL_PAGE.login()
                            }
                        }
                        }) 
                    },
              })
            }
        });
    },



})



    

"pages/relate/relate",
"pages/ware_in/ware_in",
    "pages/ware_out_card/ware_out_card",
    "pages/cart/cart",
    "pages/private/private",
    "pages/public/public",
    "pages/together/together",
    "pages/painter/painter",
    "pages/watermark/watermark",
    "pages/gallery/gallery",
    "pages/category/category",
    "pages/player/player",
    "pages/manage/manage"