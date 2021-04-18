// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const {
      OPENID
    } = cloud.getWXContext();
    

    // 更新为true
    await db.collection('weekly_report').where({
      startDate: event.startDate,
      endDate: event.endDate,
      touser: OPENID
    }).update({
      data: {
        done: true
      }
    })

    return result;
  } catch (err) {
    console.log(err);
    return err;
  };
};