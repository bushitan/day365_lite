'use strict';

/* api.js  公共类
    小程序的api接口集合 
 */ 
// 1488713872
// gxhxweihuaxuntong077155533360000
// var host_url = 'http://127.0.0.1:8001/'; 
// var host_url = 'http://127.0.0.1:8000/'; 
// var host_url = 'http://127.0.0.1:8001/day365/';
// var host_url = 'http://192.168.199.203:8000/day365/';
// var host_url = 'http://192.168.200.103:8000/day365/';
var host_url = 'https://www.12xiong.top/day365/';



// var host_url = 'http://www.12xiong.top:8006/day365/'; 
// var host_url = 'http://192.168.199.203:8000/huaxun/'; 
// var host_url = 'http://192.168.199.203:8001/huaxun/'; 
// var host_url = 'http://192.168.199.203:8002/huaxun/'; 
// var host_url = 'http://192.168.200.23:8000/huaxun/'; 
// var host_url = 'http://192.168.200.27:8000/'; 
// var host_url = 'https://www.12xiong.top/wx_app/';
// var host_url = 'https://xcx.308308.com/huaxun/';
// var host_url = 'http://www.12xiong.top/';

function Request(options) {
    // url, data, success, fail, complete

    var data =  options.data
    if (data == undefined)
        data = {}
    data['session'] = wx.getStorageSync("session")  //每个请求都加session
    wx.request
        ({
            url: options.url,
            method: "GET",
            data: data,
            success: function (res) {
                if (options.success != undefined)
                    options.success(res)
            },
            fail: function (res) {
                if (options.fail != undefined)
                    options.fail(res)
            },
            complete: function (res) {
                if (options.complete != undefined)
                    options.complete(res)
            },
        })
}


module.exports = {
    Request: Request,

    DAY_INDEX: host_url + 'lite/day/index/',

    MY_INDEX: host_url + 'lite/my/index/',
    MY_SET_CLOCK: host_url + 'lite/my/set/clock/',
    MY_SET_LOGO: host_url + 'lite/my/set/logo/',

    UPLOAD_GET_TOKEN: host_url + 'lite/upload/get/token/',
    UPLOAD_CALLBACK: host_url + 'lite/upload/callback/',

    USER_LOGIN: host_url + 'lite/user/login/',
    // DAY_INDEX: host_url + 'day365/my/set/clock/',

};

