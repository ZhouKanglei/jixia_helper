

Page({
  data: {url: ""},
  
  onLoad: function(options) {    
  	var url = options.url;
  	url = url.replace(/>/g, '=');
  	url = url.replace(/@/g, '?');
    url = url.replace(/</g, '&');
    if (url.search("https://mp.weixin.qq.com/s?") == -1) {
    	url = "https://mp.weixin.qq.com/s?" + url;
    }

    this.setData({    
      url: url
    });

    console.log(url);
  } 
})
