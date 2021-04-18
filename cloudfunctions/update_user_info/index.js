// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const result = await db.collection('report_member').where({
      nickName: event.nickName
    }).update({
      data: {
        userInfo: event.userInfo
      }
    });

    return result;
  } catch (err) {
    console.log(err);
    return err;
  };

};