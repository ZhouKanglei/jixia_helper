Page({
  /**
   * 页面的初始数据
   */
  data:{
    
  },

  itemDisplay: function (e) {

    var time = e.currentTarget.dataset.time;

    var time_ = time.replace('T', ' ');
    time_ = time_.substring(0, 19);
    console.log(time_);

    if (this.data.hidden) {
      this.setData({
        hidden: false,
        current: time,
        time_: time_
      });
    } else if (this.data.current == time) {
      this.setData({
        hidden: true,
        current: '',
        time_: ''
      });
    } else {
      this.setData({
        hidden: false,
        current: time,
        time_: time_
      });
    }
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
			title: '加载中，请稍候',
			icon: 'loading',
			duration: 500
		})

    wx.cloud.callFunction({
      name: 'search_notice'
    }).then(res => {
      console.log(res);
      this.setData({
        notice: res.result.data,
        hidden: true,
        current: '',
        time_: ''
      });
    }).catch(err => {
      console.log(err);
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角转发
   */
  onShareAppMessage: function () {

  },

  /**
   * 页面滚动触发事件的处理函数
   */
  onPageScroll: function () {

  },

  /**
   * 当前是 tab 页时，点击 tab 时触发
   */
  onTabItemTap: function(item) {

  },
})