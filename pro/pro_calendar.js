/** 1
 *  初始化365天，用灰色填充
 */
function InitDay() {
    var _render_matrix = []
    var list7 = new Array(7)
    // 循环53周，最后一周多1天
    for (var i = 0; i < 53; i++) {
        if (i == 52)
            list7 = new Array(1)
        _render_matrix.push({
            week_num: i,
            week_list: list7,
        })
    }
    return _render_matrix
}



/** 2
 * 点击day方块，
 * 1 未到日期
 * 2 已经过去，没有东西
 * 3 已经过去，有东西
 */
function CheckDayClickIsExists(GP,todayID, clickID, dayList){
    // var _currentDay = GP.data.dayList[_day_id]
    
    var clickID = parseInt(clickID)
    var todayID = parseInt(todayID)

    if ( clickID  > todayID) {
        wx.showModal({
            title: '文馨提示',
            content: '这一天还没到，千里之行始于足下，先留下今天的印记吧',
            // showCancel: false,
            confirmText: "添加印记",
            success: function (res) {
                if (res.confirm) {
                    GP.uploadAction()
                }
            }
        })
        return false
    }
    
    if (clickID < todayID &&  dayList[clickID].file_list.length == 0) { //当天天数没内容，提示后结束
        wx.showModal({
            title: '文馨提示',
            content: '这一天已经过去了，主人却没留下什么东西哦~~请珍惜当下，现在就干',
            // showCancel: false,
            confirmText: "添加印记",
            success: function (res) {
                if (res.confirm) {
                    GP.uploadAction()
                } 
            }
        })
        return false
    }
    if (clickID == todayID && dayList[clickID].file_list.length == 0) { //当天天数没内容，提示后结束
        wx.showModal({
            title: '文馨提示',
            content: '今天的时间正在被吃掉！主人应该留下印记^_^',
            // showCancel: false,
            confirmText: "添加印记",
            success: function (res) {
                if (res.confirm) {
                    GP.uploadAction()
                }
            }
        })
        return false
    }
    return true
}


/**
 * 将1维的file_list 转换为  day_list （长度为365）
 */
function FileList_2_DayList(file_list){
    var _day_list = []
    for (var i = 0; i < 365; i++) {

        _day_list.push({
            id: i,
            color: COLOR.BASE,
            file_list: [],
        })
    }

    // 将个人数据填充 dayList 数据结构
    for (var i = 0; i < file_list.length; i++) {
        var _create_day = file_list[i].create_day
        _day_list[_create_day]["file_list"].push(file_list[i])
    }
    return _day_list
}

/**
 * 将 day_list  转换为  render_matrix  渲染wxml的矩阵
 * //dayList 渲染为 dayShowList  -- wxml需要的格式
 */
function DayList_2_RenderList(day_list, todayID ){
    var _day_list = day_list
    
    var _render_matrix = []
    for (var i = 0; i < 53; i++) { // 循环53周，最后一周多1天
        var temp = []
        for (var j = 0; j < 7; j++) {   //循环一周七天
            if ((i * 7 + j) >= _day_list.length) //大于365天，结束循环// console.log(i,j,i * 7 + j)
                break
            if ((i * 7 + j) > 348)
                getColorStr(_day_list[349], todayID)
            temp.push({
                id: i * 7 + j,
                color: getColorStr(_day_list[i * 7 + j], todayID),
            })
        }

        _render_matrix.push({ //设置周数编号，加载一周数组
            week_num: i,
            week_list: temp
        })
    }
    return _render_matrix
}






/**
   * 根据 dayList[i * 7 + j]的
      num_image
      num_audio
      num_video
      计算颜色
   */
function getColorStr(day ,todayID){
        
    if (day["file_list"].length == 0) {
        if (day.id <= todayID)
            return COLOR.BASE
        else
            return COLOR.BASE_2
    }
    else if (day["file_list"].length == 1)
        return COLOR.LEVEL_1
    else if (day["file_list"].length == 2)
        return COLOR.LEVEL_2
    else if (day["file_list"].length == 3)
        return COLOR.LEVEL_3
    else 
        return COLOR.LEVEL_4
    // else if (day["file_list"].length == 4)
    //     return COLOR.LEVEL_4
    // else 
    //     return COLOR.LEVEL_5
}
var COLOR = {
    BASE: '#f9f9f9', //fbfbfb  浅色
    BASE_2: '#ebedf0',    //eee  浅色

    LEVEL_1: "#c6e48b",
    LEVEL_2: "#7bc96f",
    LEVEL_3: "#239a3b",
    LEVEL_4: "#196127",
    LEVEL_5: "#0e4018",
    

}

module.exports = {
    CheckDayClickIsExists: CheckDayClickIsExists,
    InitDay: InitDay,
    FileList_2_DayList: FileList_2_DayList,
    DayList_2_RenderList:DayList_2_RenderList,
}

