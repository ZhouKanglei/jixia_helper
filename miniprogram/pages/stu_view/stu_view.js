const GetPeriod = require("../../utils/getperiod.js");
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    startDate: '',
    endDate: '',
    items: [],
    title: [],
    note: [],
    flag: true,
    content: {},
    num: 0
  },

  dealData: function (data) {
    console.log(data)
    if(data == undefined) {
      this.setData({flag: false})
      this.setData({content: ''})

      wx.showToast({
        title: '查询不到内容',
        icon: 'none',
        duration: 500
      })

      // wx.reLaunch({
      //   url: '../index/index',
      // })
    } else {
      console.log(data.content)
      this.setData({content: data.content.text_save})
      this.setData({title: data.content.text_title})
      this.setData({note: data.content.text_note})
      this.setData({flag: true})
    }
  },

  search_item: function () {
    wx.cloud.callFunction({
      name: 'search_stu',
      data: {
        name: this.data.name,
        startDate: this.data.startDate,
        endDate: this.data.endDate
      },
      success: res => {
        console.log(res)
        this.dealData(res.result.data[0])
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    console.log(options)
    if (options.startDate == undefined && options.endDate == undefined) {
      console.log('--------------------')
      this.getWeekStartDate(0)
    } else {
      this.setData({
        startDate: options.startDate,
        endDate: options.endDate
      })
    }

    this.setData({name: options.name,})
    this.search_item();
    
  },

  setDate: function () {
    this.search_item();
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
    
    console.log('今天是本周第 '+ this.nowDayOfWeek)

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
      title: this.data.name + this.data.startDate + '至' + this.data.endDate + '周报',
      path: '/pages/stu_view/stu_view?name=' + this.data.name + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate,
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
      title: this.data.name + this.data.startDate + '至' + this.data.endDate + '周报',
      path: '/pages/stu_view/stu_view?name=' + this.data.name + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate
    }
  }

})