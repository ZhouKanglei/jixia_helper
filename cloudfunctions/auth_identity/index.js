// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  try {

    const {OPENID} = cloud.getWXContext();
    const result = await db.collection('report_member').where({
      nickName: event.userInfo.nickName
    }).update({
      data: {
        openid: OPENID,
        userInfo: event.userInfo
      }
    });

    return result;
  } catch (err) {
    console.log(err);
    return err;
  };

};