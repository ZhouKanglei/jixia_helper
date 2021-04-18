Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		url: "https://mp.weixin.qq.com/s?__biz=MzUyMTE2NDYxMQ==&mid=2247486098&idx=1&sn=acf28c1525ffeebcbb1c3c1df4e1e33d&chksm=f9de08becea981a8ec69e3737aa757377903c086afdf10cfa4fa014197369f72d311882b7c16&token=271350555&lang=zh_CN#rd",
		userInfo: {},
		openid: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showToast({
			title: '欢迎您……',
			icon: 'loading',
			duration: 200
		})
	},


	// 获取openid和userinfo
	global_config(e) {
		// 全局参数
		var app = getApp()
		app.globalData.hasLogin = true;
		app.globalData.userInfo = e.detail.userInfo;

		console.log('userInfo', e.detail.userInfo)

		// userInfo
		this.setData({
			userInfo: e.detail.userInfo
		})

		// 获取openid
		wx.cloud.callFunction({
			name: 'login',
			success: res => {
				// 设置openid
				app.globalData.openid = res.result.openid;
				this.setData({
					openid: res.result.openid
				})
				console.log('openid', res.result.openid)
			},

			fail: err => {
				console.log(err)
			}
		})
	},

	// 根据查询结果判断用户是否有访问权限
	check_user_permission: function (data) {
		if (data.length == 0) {
			wx.showToast({
				title: '您无权限！！！',
				icon: 'none'
			})
		} else {
			if (data.userInfo != this.data.userInfo) {
				// update user info by nickName
				wx.cloud.callFunction({
					name: 'update_user_info',
					data: {
						userInfo: this.data.userInfo,
						nickName: this.data.userInfo.nickName
					},
					success: res => {
						console.log(res)
					},
					fail: err => {
						console.log(err)
					}
				})
			}

			// 保存member记录
			var app = getApp()
			app.globalData.member = data;
			app.globalData.report_permission = true;
			console.log(app.globalData.userInfo)

			// 跳转 VR 715 周报提交平台
			wx.navigateTo({
				url: '../report/report'
			})
		}
	},


	bindGetUserInfo_report: function (e) {
		if (e.detail.userInfo) {
			// 获取openid和userinfo
			this.global_config(e);

			// console.log(this.data.userInfo.nickName)
			// 查询member
			wx.cloud.callFunction({
				name: 'search_user_by_nickName',
				data: {
					nickName: this.data.userInfo.nickName
				},
				success: res => {
					console.log(res.result.data)
					// 判断用户是否有访问权限，0避免昵称重复
					this.check_user_permission(res.result.data[0])
				},
				fail: err => {
					console.log(err)
				}
			})
		} else {
			// 拒绝登录
			wx.showModal({
				cancelColor: 'cancelColor',
				title: '警告',
				content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入！！！',
				showCancel: false,
				confirmText: '返回授权',

				success: res => {
					if (res.confirm) {
						console.log('用户点击了返回授权')
					} 
				},
				fail: err => {
					console.log(err)
				}
			})
		}
	},

	bindViewTap: function () {
		var url = "__biz=MzUyMTE2NDYxMQ==&mid=2247486098&idx=1&sn=acf28c1525ffeebcbb1c3c1df4e1e33d&chksm=f9de08becea981a8ec69e3737aa757377903c086afdf10cfa4fa014197369f72d311882b7c16&token=271350555&lang=zh_CN#rd";
		url = url.replace('?', '@');
		url = url.replace(/&/g, '<');
		url = url.replace(/=/g, '>');
		wx.navigateTo({
			url: "../weixinlink/weixinlink?url=" + url
		});
	},

	onShareAppMessage: function (e) {
		console.log('分享')
	},

	onShareTimeline: function () {
		console.log('朋友圈')
	}
})