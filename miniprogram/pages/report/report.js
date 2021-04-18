
Page({
	/**
	 * 页面的初始数据
	 */
	data:{
		url: "https://mp.weixin.qq.com/s?__biz=MzUyMTE2NDYxMQ==&mid=2247486098&idx=1&sn=acf28c1525ffeebcbb1c3c1df4e1e33d&chksm=f9de08becea981a8ec69e3737aa757377903c086afdf10cfa4fa014197369f72d311882b7c16&token=271350555&lang=zh_CN#rd",
		userInfo: {},
		openid: '',
		tmplIds: ['yIeCCH7MbdyfCBugkqemrcETMtjOWSyCnGzmLYwlEww']
	},

	search_teacher: function () {
		// 获取教师记录通过role
		wx.cloud.callFunction({
			name: 'search_teacher',

			success: res => {
				console.log('老师', res.result.data[0])
				// 设置局部变量
				var app = getApp()
				if (res.result.data.length != 0) {
					app.globalData.teacher = res.result.data[0]
				}		
			},
			fail: err => {
				console.log('获取老师失败！！！', err)
			}
		})
	},

	search_leader: function () {
		// 通过组别获取leader
		wx.cloud.callFunction({
			name: 'search_leader',
			data: {
				group: this.data.member.group
			},

			success: res => {
				console.log('组长', res)
				// 设置局部变量
				var app = getApp()
				if (res.result.data.length != 0) {
					app.globalData.leader = res.result.data[0]
				}
			},
			fail: err => {
				console.log('获取组长失败！！！', err)
			}
		})
	},

	search_personal_report: function () {
		wx.navigateTo({
			url: '../stu_view/stu_view?name=' + this.data.member.name,
		})
	},

	search_global_report: function () {
		wx.navigateTo({
			url: '../global_view/global_view?role=' + this.data.member.role + '&group=' + this.data.member.group,
		})
	},


	submit_weekly_report: function () {
		// 跳转周报页面
		this.search_teacher()
		this.search_leader()
		
		wx.navigateTo({
			url: '../weekly_report/weekly_report',
		})
	},

	onLoad: function (options) {
		// 设置局部变量
		var app = getApp()
		console.log('访问权限：', app.globalData.report_permission)
		console.log(app.globalData)
		app.globalData.tmplIds = this.data.tmplIds

    this.setData({
      userInfo: app.globalData.userInfo,
      member: app.globalData.member,
      openid: app.globalData.openid,
			report_permission: app.globalData.report_permission,
			tmplIds: app.globalData.tmplIds
		})
		
		// 校验合法性
		if (this.data.userInfo == {} || this.data.report_permission == false || this.data.member == {}) {
      wx.showToast({
        title: '非法闯入',
        icon: 'none'
			})
			
      // 跳转页面
      wx.reLaunnch({
        url: '../index/index',
      })
    } else {
			console.log('正常登入')
		}
	},

	subscribe_template: function () {
		console.log([this.data.tmplIds])

    wx.requestSubscribeMessage({
      tmplIds: this.data.tmplIds,
      success: res => {
        console.log('允许订阅')
        console.log(res)

				wx.showToast({
					title: '授权周报提醒成功',
					icon: 'none'
				})
				
      }
    });
	},

	urge_member_submit: function () {
		console.log(this.data.userInfo)
	},

	onShareAppMessage: function (e) {
		console.log('分享')
	}
	

})