// pages/calendar/calendar.js

var API = require('../../utils/api.js');
var QINIU = require('../../utils/qiniu.js');
var PRO_Calendar = require('../../pro/pro_calendar.js');
var RECORD= require('../../utils/record.js');
var APP = getApp()
var GP;
var KEY_SESSION = "session";
var FILE_STYLE_IMAGE = 0;
var FILE_STYLE_AUDIO = 1
var FILE_STYLE_VEDIO = 2;

Page({

    data: {
        FILE_STYLE_IMAGE : 0,
        FILE_STYLE_AUDIO : 1,
        FILE_STYLE_VEDIO : 2,
        title: [1, 2, 3, 4, 5,6,7],

        todayID:1,
        power:100,
        currentDay:{}, //点击日期后，当天的内容
        isShowPhotoPreview : false , // 显示每日相册
        scrollLeft:100,

        //上传
        isUpdate : false,
        //录音
        showRecordDialog:false, //显示录音界面
        isRecording: false,
        isAbleUpload: false, // 录音完成才能上传
        clock:'录音倒计时：(60)秒',
    },
  

    /**
        * 上传操作 -- 选择器
        */
    uploadAction() {
        if (GP.data.isUpdate == true){
            wx.showToast({
                title: '上传中',
                icon:"loading"
            })
            return 
        }

        wx.showActionSheet({
            itemList: ['图片', '声音', '小视频'],
            success: function (res) {
                console.log(res.tapIndex)
                if (res.tapIndex == 0)
                    QINIU.UploadImage(GP)
                else if (res.tapIndex == 1)
                    GP.openRecord()
                else
                    QINIU.UploadVideo(GP)
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },

    /**上传录音 */
    uploadRecord(){
        QINIU.UploadAudio(GP, RECORD.GetAudioFile())
        
    },

    // 开始上传的动作，由qiniu自动调取
    uploadStartAction() {
        GP.setData({
            isUpdate: true
        })
        wx.showToast({
            title: '上传中',
            icon: "loading"
        })
    },
    // 上传成功动作，由qiniu自动调取
    uploadSuccessAction(res) {
        var data = JSON.parse(res.data);
        var _file_list = GP.data.fileList
        console.log(data)
        _file_list.push(data)
        // _file_list.push({
        //     style: 0,
        //     create_date: '2017-1-3',
        //     url: 'http://img.12xiong.top/help_huaxun_4.jpg',
        //     create_day: 3,
        //     content: null,
        //     create_hour: '09:19:17',
        //     create_time: '2017-12-16 09:19:17',
        // })
        GP.renderDayShowList(_file_list)

        GP.setData({
            isUpdate: false
        })
        wx.showToast({
            title: '上传成功',
            icon: "success"
        })
    },

    // 上传失败的动作，由qiniu自动调取
    uploadFailActionres() {
        GP.setData({
            isUpdate: false
        })
        wx.showModal({
            title: '上传失败',
            content: '上传网络连接失败，请重试',
            showCancel:false,
        })
        // wx.showToast({
        //     title: '上传网络连接失败，请重试',
        //     icon: "loading"
        // })
    },


    //点击年份
    yearAction() {
        wx.showActionSheet({
            itemList: ['2016', '2017'],
            success: function (res) {
                console.log(res.tapIndex)
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },

    /**
     * 每日操作 -- 点击日期，打开相册，滚动条归0
     */
    dayClick(e){
        var clickID = e.currentTarget.dataset.day_id
        if (PRO_Calendar.CheckDayClickIsExists(GP,GP.data.todayID, clickID, GP.data.dayList) == true)
            GP.setData({
                currentDay: GP.data.dayList[clickID],
                isShowPhotoPreview: true,
                scrollLeft: 0,
            })
    },
    /**
     * 每日操作 -- 关闭相册
     */
    dayPhotoPreviewClose(e) {
        GP.setData({
            isShowPhotoPreview:false,
        })
    },

    /**
     * 每日操作 -- 长按滑动无响应
     */
    dayLongClick(e){
        console.log(e)
    },

    /**
     * 每日操作 -- 预览图片
     */
    dayImagePreview(e){

        wx.previewImage({
            urls: [e.currentTarget.dataset.image_url],
        })
    },


   


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this

        if (APP.globalData.isLogin == true)
            GP.onInit(options)
        else
            APP.login(options)

        // var _todayID = GP.getOffsetDays(Date.now(), (new Date(2017, 1, 1)).getTime())
        // GP.setData({
        //     todayID: 363
        //     // todayID: _todayID
        // })
        
    },

    getOffsetDays(time1, time2) {
        var offsetTime = Math.abs(time1 - time2);
        return Math.floor(offsetTime / (3600 * 24 * 1e3));
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    
    },

    /**
     * 登陆成功--初始化页面
     */
    onInit(){        
        GP.setData({
            dayShowList: PRO_Calendar.InitDay(), //开始用灰色填充
        })
       
        API.Request({
            'url': API.DAY_INDEX,
            'success': function (res){
                var object = res.data
                // GP.setData({
                //     fileList: object.file_list
                // })
                GP.setData({

                    todayDate:object.today_date,
                    todayID: object.today_id,
                    power:  parseInt ((365 - parseInt(object.today_id) )/365*100),
                })

                GP.renderDayShowList(object.file_list)
            }
        })
       
        RECORD.Init(GP)  //配置录音参数
    },

    /**
     * 初始化 -- 渲染用户的day365
     *  dayList 数据结构
     *  _day_list = [node]
            node = {
                id: i,
                color: "",
                file_list:[],
        }
     */
    renderDayShowList(upload_list){

        var _file_list = upload_list
        var _day_list = PRO_Calendar.FileList_2_DayList(_file_list)
        var _day_show_list = PRO_Calendar.DayList_2_RenderList(_day_list, GP.data.todayID)
        GP.setData({
            fileList: _file_list,
            dayList : _day_list,
            dayShowList : _day_show_list,
        })
    },

  

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    
    },





      //关闭录音
    closeRecord() {
        GP.setData({
            showRecordDialog: false,
            // isAbleUpload:false
        })
    },
    openRecord() {
        GP.setData({
            showRecordDialog: true,
            // isAbleUpload: false
        })
    },

    // uploadRecord() {
    //     QINIU.UploadAudio(GP)
    // },
    //开始录音的时候
    start: function () {

        //开始后，禁止上传文件
        GP.setData({
            isRecording: true,
        })

        RECORD.Start()

    },
    //停止录音
    stop: function () {
        RECORD.Stop()

        GP.setData({
            isRecording: false,
            isAbleUpload: true,
        })
    },
    //播放声音
    play: function () {
        RECORD.Play()
    },
})

