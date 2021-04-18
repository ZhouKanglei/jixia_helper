
function unique (arr) {
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    if(res.indexOf(arr[i]) == -1) {
      res.push(arr[i]);
    }
  }
  return res;
}
let interstitialAd = null
Page({
  checkCurrent: function (e) {
    this.setData({
      currentData: e.currentTarget.dataset.current
    });
  },

  itemDisplay: function (e) {
    var sub = e.currentTarget.dataset.subject;
    var old_sub = this.data.currentSub;
    var hidden = this.data.hidden;

    if (hidden) {
      this.setData({
        hidden: false,
        currentSub: sub
      });
    } else {
      this.setData({
        hidden: true,
        currentSub: sub
      });
    }

    if (sub !=  old_sub && !hidden) {
      this.setData({
        hidden: false,
        currentSub: sub
      });
    } 

  },

  copy: function (e) {
    var that = this;
    wx.setClipboardData({
     data: e.currentTarget.dataset.link + "\n------\n稷殿下",
     success: function (res) {
      wx.showToast({
        title: '链接复制成功',
        icon: 'success',
        duration: 1000
      })
     }
    });
   },

  bindViewTap: function (e) {
    var url = e.currentTarget.dataset.article;
    url = url.replace('?', '@');
    url = url.replace(/&/g, '<');
    url = url.replace(/=/g, '>');
    wx.navigateTo({
      url: "../weixinlink/weixinlink?url=" + url
    });
  },
   
  dealData: function (data) {
    var links = data;
    var manus = [];
    var subs = [];
    var currentData = 0;
    var cnt = 0;

    for (var i = 0; i < links.length; i++) {
      manus.push(links[i].type);
    }
    manus = unique(manus);
    manus = manus.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'accent'}));
    //manus.splice(0, 0, "全部");

    for (var i = 0; i < manus.length; i++) {
      var sub = [];
      for (var j = 0; j < links.length; j++) {
        if (links[j].type == manus[i] || manus[i] == "全部") {
          sub.push(links[j].subject);
        }
      }

      sub = unique(sub);
      sub = sub.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'accent'}));
      subs.push(sub);
      console.log(sub);
    }

    subs = unique(subs);
    console.log(manus);
    console.log(subs);

    this.setData({
      list_data: data,
      list_manus: manus,
      list_subs: subs,
      currentData: 0,
      hidden: true
    });
  },

  onLoad: function () {
    wx.showToast({
			title: '加载中，请稍候',
			icon: 'loading',
			duration: 500
		})

    if(wx.createInterstitialAd){
      interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-a774bd1c96704323' })
      interstitialAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      interstitialAd.onError((err) => {
        console.log('onError event emit', err)
      })
      interstitialAd.onClose((res) => {
        console.log('onClose event emit', res)
      })
    }
    interstitialAd.show().catch((err) => {
      console.error(err)
    })

    // var res = require("../../data/jidianxia.js");
    wx.cloud.callFunction({
      name: 'search_temp'
    }).then(res => {
      console.log(res);
      this.dealData(res.result.data);
    }).catch(err => {
      console.log(err);
    });
  },

  onShareAppMessage: function (e) {
		console.log('分享')
	},

	onShareTimeline: function () {
		console.log('朋友圈')
	}
})
