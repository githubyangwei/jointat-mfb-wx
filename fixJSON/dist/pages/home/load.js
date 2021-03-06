'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {},
  onLoad: function onLoad(option) {
    //wx.login   查询是否有用户有用户的直接登录getSetting  返回之前的页面
    //           无用户的跳转login页面
    //           有用户但无权限的 跳转login 同时显示微信一键登录
    console.log(option.turnUrl);
    //http://192.168.11.109:8080/jointat-mfb-app/wechat/getOpenid

    wx.login({
      success: function success(res) {
        console.log(res);
        if (res.code) {
          var sendCode = res.code;
          // var sendSecret="ffcc2a4affd3243c1f01ce15252c7a78";  //test程序

          // var sendAppid = "wx7ce84b7d926d08b9";
          // var sendSecret = "a2d35cbf9fbe672bed8e4fe6b936ee90";
          // var authorization_code = "authorization_code";

          // var openid="o1xgJ44hnMMADEHzzdnRYpIw9Mvo";

          //发起网络请求
          wx.request({
            url: wx.url + 'wechat/getWeChatOpen',
            header: {
              'content-type': 'application/json'
            },
            data: {
              code: res.code
            },
            success: function success(coders) {
              var ssKey = coders.data.res.session_key;
              var openid = coders.data.res.openid;

              wx.request({
                url: wx.url + 'appUser/existsUser',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  openid: openid
                },
                success: function success(UserRes) {
                  if (UserRes.data.res) {
                    // 已有用户  获取并跳转 
                    var getUser = UserRes.data.res;
                    console.log(option.turnUrl);

                    try {
                      wx.setStorageSync('userObj', JSON.stringify(getUser));
                      wx.reLaunch({
                        url: '/' + unescape(option.turnUrl)
                      });
                    } catch (e) {}
                  } else {
                    wx.reLaunch({
                      url: '/pages/home/login?ssk=' + escape(ssKey) + '&openid=' + escape(openid) + '&turnUrl=' + option.turnUrl
                    });
                  }
                }
              });
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
  }
});