const GetPeriod = require("../../utils/getperiod.js");
var util = require('../../utils/util.js');

var compare = function (obj1, obj2) {
  var val1 = obj1.saveTime;
  var val2 = obj2.saveTime;
  if (val1 < val2) {
      return 1;
  } else if (val1 > val2) {
      return -1;
  } else {
      return 0;
  }            
} 

Page({

  data: {
    name: '',
    startDate: '',
    currentGroup: '',
    data: [],
    endDate: '',
    items: [],
    title: [],
    group: '',
    role: '',
    note: [],
    flag: true,
    member: {},
    num: 0
  },

  goto_stu_view: function (e) {
    var name = e.currentTarget.dataset.stu
    // goto
    wx.navigateTo({
      url: '../stu_view/stu_view?name=' + name + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate,
    })
  },

  dealData: function (data) {
    if (data.length == 0) {
      this.setData({
        flag: false
      })
      this.setData({
        content: ''
      })

      wx.showToast({
        title: '查询不到提交的内容',
        icon: 'none',
        duration: 500
      })

      this.setData({
        saveTime: {}
      })
      this.setData({
        submit_member: {}
      })

    } else {
      this.setData({
        flag: true
      })

      var submit_member = {}
      var saveTime = {}
      for (let i = 0; i < data.length; i++) {
        submit_member[data[i].name] = true
        saveTime[data[i].name] = data[i].saveTime
        console.log(data[i].name, '于', data[i].saveTime, '提交周报')

        var j = this.data.data.findIndex((value)=>value.name == data[i].name)

        console.log('j: ', j)

        var time = 'data[' + j + '].saveTime'
        var submit = 'data[' + j + '].submit'

        this.setData({
          [time]: data[i].saveTime,
          [submit]: true
        })

      }
      console.log('保存时间', saveTime)

      this.setData({
        saveTime: saveTime,
      })

      this.setData({
        submit_member: submit_member
      })

      // 排序
      console.log(this.data.data)
      var data = this.data.data
      data = data.sort((a, b) => {
        if (a.saveTime > b.saveTime) {
          return 1
        } else {
          return -1
        }
      })
      this.setData({
        data: data
      })
      console.log(this.data.data)
    }
  },

  search_weekly_report_by_date: function () {
    wx.cloud.callFunction({
      name: 'search_weekly_report_by_date',
      data: {
        startDate: this.data.startDate,
        endDate: this.data.endDate
      },
      success: res => {
        console.log('本周周报', res)
        this.dealData(res.result.data)
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  // 查询用户数据
  search_user_all: function () {
    // 查询所有用户
    wx.cloud.callFunction({
      name: 'search_user_all',

      success: res => {
        console.log('查询所有用户', res)

        // 小组名
        var group = []
        var data = res.result.data
        for (let index = 0; index < data.length; index++) {
          if (group.indexOf(data[index].group) == -1 && data[index].role != '老师') {
            if (data[index].group == this.data.group && this.data.role == '组长') {
              group.push(data[index].group)
            }

            if (this.data.role == '老师') {
              group.push(data[index].group)
            }
          }
        }

        group = group.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'accent'}));

        if (this.data.role == '老师') {
          group.push('全部')
        }
        
        var currentGroup = group[0]

        this.setData({
          group: group,
          data: data
        })

        if (this.data.currentGroup == '') {
          this.setData({currentGroup: currentGroup})
        }

        console.log('小组', group)

        // 查询周报
        this.search_weekly_report_by_date();
      }
    })
  },


  onLoad: function (options) {
    if (options.role == undefined || options.role == '成员') {
      wx.showToast({
        title: '无权限',
        icon: 'none',
        duration: 1000
      })
      // 跳转
      wx.navigateBack({
        url: '../report/report',
      })
    } else {
      wx.showToast({
        title: '查询中',
        icon: 'loading',
        duration: 1000
      })
      console.log(options)

      this.setData({
        role: options.role,
        group: options.group
      })

      if (options.startDate == undefined) {
        this.getWeekStartDate(0);
      } else {
        this.setData({
          startDate: options.startDate,
          endDate: options.endDate
        })
      }
      
      // 查询所用用户数据库
      this.search_user_all()
    }
  },

  setDate: function () {
    
    this.search_user_all();
  },

  checkCurrent: function (e) {
    var group = e.currentTarget.dataset.group

    this.setData({
      currentGroup: group
    })
  },

  // 点击上一周
  prevWeek: function (e) {
    this.data.num = this.data.num - 7;
    this.getWeekStartDate(this.data.num);
    this.setDate();
    // console.log(this.data.num)

    // wx.reLaunch({
    //   url: '/pages/stu_view/stu_view?name=' + this.data.name + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate
    // })
  },
  // 点击下一周
  nextWeek: function (e) {
    this.data.num = this.data.num + 7;
    this.getWeekStartDate(this.data.num);

    this.setDate();
    // wx.reLaunch({
    //   url: '/pages/stu_view/stu_view?name=' + this.data.name + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate
    // })
  },

  //获取本周的开始日期
  getWeekStartDate: function (numDay) {
    let that = this;
    this.now = new Date();
    this.nowYear = this.now.getYear(); //当前年 
    this.nowMonth = this.now.getMonth(); //当前月 
    this.nowDay = this.now.getDate(); //当前日 
    this.nowDayOfWeek = this.now.getDay(); //今天是本周的第几天 
    this.nowYear += (this.nowYear < 2000) ? 1900 : 0;

    if (this.nowDayOfWeek == 0) {
      this.nowDayOfWeek = 7
    }

    console.log('今天是本周第 ' + this.nowDayOfWeek)

    let dateStart = GetPeriod.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + 1 + numDay));
    let dateEnd = GetPeriod.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + 7 + numDay));
    // console.log(dateStart)
    // 获取今天日期
    let now = GetPeriod.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay));
    now = now.replace(/-/g, "/");
    now = now.substring(5);
    this.setData({
      startDate: dateStart,
      endDate: dateEnd,
      now: now,
      dates: now,
    })
    // 初始化数据(历史纪录)
    var timestamp = Date.parse(new Date(this.data.dateStart));
    timestamp = timestamp / 1000;
    // console.log(timestamp);
    that.setData({
      timestamp: timestamp
    })
  },

	onShareAppMessage: function (e) {
		return {
      title: 'VR 715 周报 ' + this.data.group,
      path: '/pages/global_view/global_view?role=' + this.data.role + '&group=' + this.data.group + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate,
      // imageUrl: "/images/1.jpg",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },

  onShareTimeline: function () {
    return {
      title: 'VR 715 周报 ' + this.data.group,
      path: '/pages/global_view/global_view?role=' + this.data.role + '&group=' + this.data.group + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate,
    }
  }

})