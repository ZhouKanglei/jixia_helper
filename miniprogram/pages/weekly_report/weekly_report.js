const GetPeriod = require("../../utils/getperiod.js");
var util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    openid: '',
    member: {},
    items: [],
    name: '',
    len: [],
    len_date: [],
    flag: [],
    empty: [],
    empty_date: [],
    content: [],
    default: false,
    content_default: {},
    title_default: {},
    content_date: [],
    paper: 'paper_none',
    paper_content: '无',
    t_length: 0,
    teacher_openid: '',
    teacher: {},
    leader: {},
    tmplIds: [],
    time: '',
    startDate: '',
    endDate: '',
    month: ['', '', '', ''],
    num: 0,
    now: '',
    currentTab: 1,
  },

  setDate: function () {
    var n = this.data.num;
    var idx = n;
    for (var index = n + 1; index <= n + 4; index++) {
      idx = idx + 7;
      var month_idx = index - n - 1;
      this.getWeekStartDate(idx);
      var month = 'month[' + month_idx + ']';
      this.setData({
        [month]: this.data.startDate + '至' + this.data.endDate
      });
    }
    this.getWeekStartDate(n);

    // 判断有无默认
    this.check_exist();
  },

  dealData: function (data) {
    // 日期设定
    this.setDate()
    // 判断有无默认
    this.check_exist()

    // 变量初始化
    var len = [];
    var flag = [];
    var content = [];
    var content_date = [];
    var empty = [];
    var empty_date = [];
    var len_date = [];

    for (var i = 0; i < data.length; i++) {
      len.push(0);
      flag = data[i].flag;
      content.push('');
      empty.push('');
    }

    for (var i = 0; i < this.data.month.length; i++) {
      len_date.push(0);
      content_date.push('');
      empty_date.push('');
    }

    this.setData({
      items: data,
      len: len,
      len_date: len_date,
      flag: flag,
      content: content,
      content_date: content_date,
      empty: empty,
      empty_date: empty_date
    });
  },

  auth_identity: function (data) {
    if (data.length == 0) {
      wx.navigateTo({
        url: '../index/index',
      })
    } else {
      console.log(data.openid);
      if (data.openid) {
        console.log('--');
      }
    }
  },

  dealDataDefault: function (data) {
    if (data.length != 0) {
      data = data[0]

      this.setData({
        content_default: data.content.text_save
      })
      this.setData({
        title_default: data.content.text_title
      })
      this.setData({
        default: true
      })
      console.log(this.data.content_default)
      console.log('有默认的……')
      // 默认操作
      for (let idx = 0; idx < this.data.items.length; idx++) {
        if(data.content.text_save[this.data.items[idx].title] == '无') {
          console.log(this.data.items[idx].title)
          this.data.items[idx].flag = true
          data.content.text_save[this.data.items[idx].title] = ''

          console.log(data.content.text_save[this.data.items[idx].title])

          var item = 'items[' + idx + '].flag'
          var content = 'content[' + idx + ']'
          this.setData({
            [item]: false,
          })
        } else {
          var content = 'content[' + idx + ']'
          var len = 'len[' + idx + ']'
          this.setData({
            [len]: data.content.text_save[this.data.items[idx].title].length,
            [content]: data.content.text_save[this.data.items[idx].title]
          })

          var item = 'items[' + idx + '].flag'
          this.setData({
            [item]: true,
          })
        }
        console.log((this.data.items[idx].title == '周度计划'))

        if (this.data.items[idx].title == '周度计划') {
          console.log(data.content.text_save[this.data.items[idx].title].length)
          for (let j = 0; j < this.data.month.length; j++) {
            var len = 'len_date[' + j + ']' 
            var empty_date = 'empty_date['  + j + ']' 
            var content_date = 'content_date[' + j + ']'
            this.setData({
              [len]: data.content.text_save[this.data.items[idx].title][this.data.month[j]].length,
              [empty_date]: '',
              [content_date]: data.content.text_save[this.data.items[idx].title][this.data.month[j]]
            })
            console.log(data.content.text_save[this.data.items[idx].title][this.data.month[j]])
          }
        }
        
      }

      this.setData({
        content_default: data.content.text_save
      })
      
    } else {
      this.setData({
        content_default: {},
        default: false
      })
      console.log('无默认的……')
    }
  },

  check_exist: function () {
    // 查询是否存在报告
    wx.cloud.callFunction({
      name: 'search_stu',
      data: {
        name: this.data.name,
        startDate: this.data.startDate,
        endDate: this.data.endDate
      },
      success: res => {
        console.log('判断是否默认 ' + this.data.startDate + '至' + this.data.endDate)
        console.log(res)
        this.dealDataDefault(res.result.data)
        // now
        console.log('今天是： ' + this.data.now)
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  onLoad: function () {
    // 全局
    var app = getApp()
    this.setData({
      userInfo: app.globalData.userInfo,
      member: app.globalData.member,
      name: app.globalData.member.name,
      openid: app.globalData.openid,
      report_permission: app.globalData.report_permission,
      teacher: app.globalData.teacher,
      leader: app.globalData.leader,
      tmplIds: app.globalData.tmplIds
    })
    
    // 校验合法性
    if (this.data.userInfo == {} || this.data.report_permission == false || this.data.member == {}) {
      wx.showToast({
        title: '尚未登陆，点击周报提交',
        icon: 'none'
      })

      // 跳转页面
      wx.reLaunnch({
        url: '../index/index',
      })
    } else {
      wx.showToast({
        title: '加载中……',
        icon: 'loading',
        duration: 1000
      })

      // 获取报告
      wx.cloud.callFunction({
        name: 'search_report',
        data: {
          db: 'report_items',
          sort_item: 'rank',
          sort: 'asc'
        },
        success: res => {
          console.log('查询报告', res)
          this.dealData(res.result.data)
        },
        fail: err => {
          console.log(err)
        }
      })
    }
  },

  bindText: function (e) {
    var t_text = e.detail.value.length;
    console.log(t_text);
    var t_len = "len[" + e.currentTarget.dataset.index + "]";
    var content = "content[" + e.currentTarget.dataset.index + "]";
    var empty = "empty[" + e.currentTarget.dataset.index + "]";

    if (this.data.items[e.currentTarget.dataset.index].title == '周度计划') {
      var content_date = "content_date[" + e.currentTarget.dataset.week + "]";
      console.log('week: ' + e.currentTarget.dataset.week);
      this.setData({
        [content_date]: e.detail.value
      });

      var len_date = "len_date[" + e.currentTarget.dataset.week + "]";
      console.log('week: ' + e.currentTarget.dataset.week);
      this.setData({
        [len_date]: t_text
      });

      var empty_date = "empty_date[" + e.currentTarget.dataset.week + "]";
      console.log('week: ' + e.currentTarget.dataset.week);
      this.setData({
        [empty_date]: ''
      });
    }

    this.setData({
      [t_len]: t_text,
      [empty]: '',
      [content]: e.detail.value
    });
  },

  checkboxChange: function (e) {
    console.log(e.detail.value);
    console.log(e.detail.value.indexOf('paper'));
    console.log(e.currentTarget.dataset.index);
    if (e.detail.value.indexOf('paper_reading') >= 0) {
      console.log('change to true');
      var flag = "items[" + e.currentTarget.dataset.index + "].flag";

      this.setData({
        [flag]: true
      })
    } else {
      console.log('change to false');
      var flag = "items[" + e.currentTarget.dataset.index + "].flag";
      this.setData({
        [flag]: false
      })
    }
  },

  checkSubcribeMessage: function () {
    console.log([this.data.tmplIds])

    wx.requestSubscribeMessage({
      tmplIds: this.data.tmplIds,
      success: res => {
        console.log('允许订阅')
        console.log(res)
        return true
      },
      fail: err => {
        console.log(err)
        return false
      }
    });
  },

  check_report_empty() {
    var flag = 0;
    for (var i = 0; i < this.data.items.length; i++) {
      console.log((this.data.items[i].flag == true) && (this.data.len[i] == 0));
      if (this.data.items[i].flag == true && (this.data.len[i] == 0)) {
        console.log('此项不能为空');
        var empty = "empty[" + i + "]";
        this.setData({
          [empty]: '此项不能为空'
        });
        flag = 1;
      }

      // 无内容默认为 ’无‘
      if (this.data.items[i].flag == false) {
        var content = "content[" + i + "]";
        this.setData({
          [content]: '无'
        });
      }
    }

    // 判断计划是否为空
    for (var i = 0; i < this.data.content_date.length; i++) {
      if (this.data.content_date[i] == '') {
        console.log('此项不能为空');
        var empty_date = "empty_date[" + i + "]";
        this.setData({
          [empty_date]: '此项不能为空'
        });
        flag = 1;
      }
      console.log('date: ' + this.data.content_date[i]);
    }

    return flag
  },

  // 保存数据
  save_report_content: function () {
    // 制作保存的数据
    var text_save = {};
    var text_title = [];
    var text_note = [];
    for (var i = 0; i < this.data.items.length; i++) {
      if (this.data.items[i].title == '周度计划') {
        text_save[this.data.items[i].title] = {};
        for (var j = 0; j < this.data.month.length; j++) {
          text_save[this.data.items[i].title][this.data.month[j]] = this.data.content_date[j];
        }
        text_title.push(this.data.items[i].title)
        text_note.push(this.data.items[i].note)
      } else {
        text_save[this.data.items[i].title] = this.data.content[i];
        text_title.push(this.data.items[i].title)
        text_note.push(this.data.items[i].note)
      }
      console.log(text_save);
    }
    var text_save_all = {
      text_save: text_save,
      text_note: text_note,
      text_title: text_title
    };

    // 保存时间
    var time = util.formatTime(new Date());
    this.setData({
      time: time
    });

    // 保存表单
    if (this.data.default == false) {
      wx.cloud.callFunction({
        name: 'save_report',

        data: {
          name: this.data.name,
          content: text_save_all,
          startDate: this.data.startDate,
          endDate: this.data.endDate,
          saveTime: this.data.time,
          group: this.data.member.group
        },

        success: res => {
          console.log('保存表单')
          console.log(res)
        },
        fail: err => {
          console.log(err)
        }
      })
    } else { // 更新表单
      wx.cloud.callFunction({
        name: 'update_weekly_report',
        data: {
          name: this.data.name,
          content: text_save_all,
          startDate: this.data.startDate,
          endDate: this.data.endDate,
          saveTime: this.data.time,
          group: this.data.member.group
        },
        success: res => {
          console.log('更新表单')
          console.log(res)
        },
        fail: err => {
          console.log(err)
        }
      })
    }
  },
  // 发送订阅消息
  send_subscribe_info: function () {
    // 查询页
    var page_view = 'pages/stu_view/stu_view?name=' + this.data.name + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate;

    // 订阅消息通知填表者
    if (this.data.default == false) {
      var tip_content = this.data.name + '已提交周报，点击查看！';
    } else {
      var tip_content = this.data.name + '已修改周报，点击查看！';
    }
    
    console.log(tip_content);
    wx.cloud.callFunction({
      name: 'send_template_info',
      data: {
        data: {
          thing1: {
            value: 'VR 715 周报提交平台'
          },
          thing2: {
            value: '周报提交提醒'
          },
          thing3: {
            value: tip_content
          }
        },
        openid: this.data.openid,
        template_id: this.data.tmplIds,
        page: page_view
      },
      success: res => {
        console.log('订阅消息通知')
        console.log(res)
        // 更改报告状态为发送
        wx.cloud.callFunction({
          name: 'update_report',
          data: {
            startDate: this.data.startDate,
            endDate: this.data.endDate
          },
          success: res => {
            console.log('更改报告状态')
            console.log(res)
          },
          fail: err => {
            console.log(res)
          }
        })
      },
      fail: err => {
        console.log(err)
      }
    })

    // 给老板发订阅消息通知
    
    if (this.data.default == false) {
      var tip_content = '老师好，' + this.data.name + '已提交周报，点击查看！';
    } else {
      var tip_content = '老师好，' + this.data.name + '已修改周报，点击查看！';
    }
    console.log(tip_content);
    wx.cloud.callFunction({
      name: 'send_template_info',
      data: {
        data: {
          thing1: {
            value: 'VR 715 周报提交平台'
          },
          thing2: {
            value: '周报提交提醒'
          },
          thing3: {
            value: tip_content
          }
        },
        openid: this.data.teacher.openid,
        template_id: this.data.tmplIds,
        page: page_view
      },

      success: res => {
        console.log('订阅消息通知 老板')
        console.log(res)
        },
        fail: err => {
        console.log(err)
        }
        })

        // 给组长发订阅消息通知
        if (this.data.member.role == '组员') {
          if (this.data.default == false) {
            var tip_content = '组长好，' + this.data.name + '已提交周报，点击查看！';
          } else {
            var tip_content = '组长好，' + this.data.name + '已修改周报，点击查看！';
          }
          
          console.log(tip_content);
          wx.cloud.callFunction({
            name: 'send_template_info',
            data: {
              data: {
                thing1: {
                  value: 'VR 715 周报提交平台'
                },
                thing2: {
                  value: '周报提交提醒'
                },
                thing3: {
                  value: tip_content
                }
              },
              openid: this.data.leader.openid,
              template_id: this.data.tmplIds,
              page: page_view
            },

            success: res => {
              console.log('订阅消息通知 组长')
              console.log(res)
            },
            fail: err => {
              console.log(err)
            }
          })
        }
        },

  submitData: function (e) {
    // 全局参数赋值避免函数执行顺序
    var app = getApp()
    this.setData({
      teacher: app.globalData.teacher,
      leader: app.globalData.leader
    })

    // 校验订阅消息
    this.checkSubcribeMessage()
    // 保单提交
    console.log('表单提交', e.detail.value);
  
    // 验证表单是否是否为空
    var flag = this.check_report_empty()

    if (flag == 1) {
      console.log(this.data.empty_date);
      wx.showToast({
        title: '填写不满足要求，请补充信息！！！',
        icon: 'none'
      })
      return -1;
    }

    // 表单内容
    console.log('表单内容', this.data.content);

    // 提交成功提示
    wx.showToast({
      title: '周报提交成功',
      icon: 'success',
      duration: 2000
    });

    // 保存
    this.save_report_content()

    // 发送订阅消息
    this.send_subscribe_info()

    // 跳转页
    var page_goto = '/pages/stu_view/stu_view?name=' + this.data.name + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate;

    // 返回结果首页
    setTimeout(function () {
      wx.redirectTo({
        url: page_goto,
      })
    }, 2000);
  },

  // 点击上一周
  prevWeek: function (e) {
    if ((this.data.now >= this.data.startDate && this.data.now <= this.data.endDate) || (this.data.now <= this.data.startDate && this.data.now >= this.data.endDate) ) {
      wx.showToast({
        title: '已过期，不能更改前一周周报，您需要在每周日前修改或提交周报',
        icon: 'none'
      })
    } else {
      this.data.num = this.data.num - 7;
      this.getWeekStartDate(this.data.num);
      this.setDate();
    }
  },
  // 点击下一周
  nextWeek: function (e) {
    this.data.num = this.data.num + 7;
    this.getWeekStartDate(this.data.num);

    this.setDate();
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

    let startDate = GetPeriod.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + 1 + numDay));
    let endDate = GetPeriod.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + 7 + numDay));
    // console.log(startDate)
    // 获取今天日期
    let now = GetPeriod.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay));
    // now = now.replace(/-/g, "-");
    // now = now.substring(5);
    this.setData({
      startDate: startDate,
      endDate: endDate,
      now: now,
      dates: now,
    })
    // 初始化数据(历史纪录)
    var timestamp = Date.parse(new Date(this.data.startDate));
    timestamp = timestamp / 1000;
    // console.log(timestamp);
    that.setData({
      timestamp: timestamp
    })
  }
})